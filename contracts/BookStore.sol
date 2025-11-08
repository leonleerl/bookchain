// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BookStore {
    struct Book {
        uint256 id;
        string title;
        string author;
        uint256 price; // 价格以 wei 为单位
        uint256 stock; // 库存
        bool exists;
    }

    struct Purchase {
        uint256 bookId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        uint256 timestamp;
    }

    address public owner;
    mapping(uint256 => Book) public books;
    mapping(address => Purchase[]) public purchases;
    mapping(address => uint256[]) public favorites; // 用户收藏的书籍ID列表
    uint256 public bookCount;
    uint256[] public bookIds;

    event BookAdded(uint256 indexed bookId, string title, string author, uint256 price, uint256 stock);
    event BookPurchased(
        uint256 indexed bookId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );
    event BookAddedToFavorites(address indexed user, uint256 indexed bookId);
    event BookRemovedFromFavorites(address indexed user, uint256 indexed bookId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier bookExists(uint256 _bookId) {
        require(books[_bookId].exists, "Book does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        bookCount = 0;
    }

    // 添加书籍（仅所有者）
    function addBook(
        string memory _title,
        string memory _author,
        uint256 _price,
        uint256 _stock
    ) public onlyOwner {
        bookCount++;
        books[bookCount] = Book({
            id: bookCount,
            title: _title,
            author: _author,
            price: _price,
            stock: _stock,
            exists: true
        });
        bookIds.push(bookCount);
        emit BookAdded(bookCount, _title, _author, _price, _stock);
    }

    // 获取所有书籍ID
    function getAllBookIds() public view returns (uint256[] memory) {
        return bookIds;
    }

    // 获取书籍信息
    function getBook(uint256 _bookId) public view bookExists(_bookId) returns (Book memory) {
        return books[_bookId];
    }

    // 购买书籍
    function purchaseBook(uint256 _bookId, uint256 _quantity) public payable bookExists(_bookId) {
        Book storage book = books[_bookId];
        require(book.stock >= _quantity, "Insufficient stock");
        require(msg.value >= book.price * _quantity, "Insufficient payment");

        book.stock -= _quantity;

        Purchase memory purchase = Purchase({
            bookId: _bookId,
            buyer: msg.sender,
            quantity: _quantity,
            totalPrice: book.price * _quantity,
            timestamp: block.timestamp
        });

        purchases[msg.sender].push(purchase);

        // 退还多余的支付
        if (msg.value > book.price * _quantity) {
            payable(msg.sender).transfer(msg.value - book.price * _quantity);
        }

        emit BookPurchased(_bookId, msg.sender, _quantity, book.price * _quantity);
    }

    // 添加到收藏
    function addToFavorites(uint256 _bookId) public bookExists(_bookId) {
        // 检查是否已经收藏
        bool alreadyFavorited = false;
        for (uint256 i = 0; i < favorites[msg.sender].length; i++) {
            if (favorites[msg.sender][i] == _bookId) {
                alreadyFavorited = true;
                break;
            }
        }
        require(!alreadyFavorited, "Book already in favorites");

        favorites[msg.sender].push(_bookId);
        emit BookAddedToFavorites(msg.sender, _bookId);
    }

    // 从收藏中移除
    function removeFromFavorites(uint256 _bookId) public {
        uint256[] storage userFavorites = favorites[msg.sender];
        bool found = false;
        for (uint256 i = 0; i < userFavorites.length; i++) {
            if (userFavorites[i] == _bookId) {
                // 将最后一个元素移到当前位置，然后删除最后一个
                userFavorites[i] = userFavorites[userFavorites.length - 1];
                userFavorites.pop();
                found = true;
                break;
            }
        }
        require(found, "Book not in favorites");
        emit BookRemovedFromFavorites(msg.sender, _bookId);
    }

    // 获取用户的收藏列表
    function getUserFavorites(address _user) public view returns (uint256[] memory) {
        return favorites[_user];
    }

    // 获取用户的购买历史
    function getUserPurchases(address _user) public view returns (Purchase[] memory) {
        return purchases[_user];
    }

    // 检查用户是否收藏了某本书
    function isFavorite(address _user, uint256 _bookId) public view returns (bool) {
        uint256[] memory userFavorites = favorites[_user];
        for (uint256 i = 0; i < userFavorites.length; i++) {
            if (userFavorites[i] == _bookId) {
                return true;
            }
        }
        return false;
    }

    // 提取合约余额（仅所有者）
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // 获取合约余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

