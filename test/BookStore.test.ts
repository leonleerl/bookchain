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

  it("Should allow owner to add books", async function () {
    const tx = await bookStore.write.addBook([
      "Test Book",
      "Test Author",
      parseEther("0.01"),
      100n,
    ]);

    expect(tx).to.not.be.undefined;
  });

  it("Should be able to get all book IDs", async function () {
    await bookStore.write.addBook([
      "Test Book 1",
      "Author 1",
      parseEther("0.01"),
      100n,
    ]);

    const bookIds = await bookStore.read.getAllBookIds();
    expect(bookIds.length).to.equal(1);
  });

  it("Should be able to purchase books", async function () {
    await bookStore.write.addBook([
      "Test Book",
      "Test Author",
      parseEther("0.01"),
      100n,
    ]);

    const book = await bookStore.read.getBook([1n]);
    expect(book.stock).to.equal(100n);

    // User purchases 1 book
    await bookStore.write.purchaseBook([1n, 1n], {
      value: parseEther("0.01"),
      account: user.account,
    });

    const bookAfter = await bookStore.read.getBook([1n]);
    expect(bookAfter.stock).to.equal(99n);
  });
});

