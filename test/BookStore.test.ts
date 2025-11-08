import { expect } from "chai";
import * as hre from "hardhat";
import { parseEther } from "viem";

describe("BookStore", function () {
  let bookStore: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await hre.viem.getWalletClients();
    bookStore = await hre.viem.deployContract("BookStore", []);
  });

  it("应该允许所有者添加书籍", async function () {
    const tx = await bookStore.write.addBook([
      "测试书籍",
      "测试作者",
      parseEther("0.01"),
      100n,
    ]);

    expect(tx).to.not.be.undefined;
  });

  it("应该能够获取所有书籍ID", async function () {
    await bookStore.write.addBook([
      "测试书籍1",
      "作者1",
      parseEther("0.01"),
      100n,
    ]);

    const bookIds = await bookStore.read.getAllBookIds();
    expect(bookIds.length).to.equal(1);
  });

  it("应该能够购买书籍", async function () {
    await bookStore.write.addBook([
      "测试书籍",
      "测试作者",
      parseEther("0.01"),
      100n,
    ]);

    const book = await bookStore.read.getBook([1n]);
    expect(book.stock).to.equal(100n);

    // 用户购买1本书
    await bookStore.write.purchaseBook([1n, 1n], {
      value: parseEther("0.01"),
      account: user.account,
    });

    const bookAfter = await bookStore.read.getBook([1n]);
    expect(bookAfter.stock).to.equal(99n);
  });
});

