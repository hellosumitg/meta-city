/* eslint-disable no-undef */

const Land = artifacts.require("./Land");

require("chai").use(require("chai-as-promised")).should();

const EVM_REVERT = "VM Exception while processing transaction: revert";

contract("Land", ([owner1, owner2]) => {
  const NAME = "Buildings";
  const SYMBOL = "BLD";
  const COST = web3.utils.toWei("0.01", "ether"); // in terms of wei (i.e 10 ** 18 form)

  let land, result; // here `result` is the variable using which we are going to check the expected output from each test

  beforeEach(async () => {
    // below, we are deploying our `Land` smart contract or creating `land` instance just for this testing.
    land = await Land.new(NAME, SYMBOL, COST);
  });

  describe("Deployment", () => {
    it("should return the contract name", async () => {
      result = await land.name();
      result.should.equal(NAME);
    });

    it("should return the symbol", async () => {
      result = await land.symbol();
      result.should.equal(SYMBOL);
    });

    it("should return the cost to mint", async () => {
      result = await land.cost();
      result.toString().should.equal(COST); // converting `result` into string as it is in `wei` or `number`
    });

    it("should return the max supply", async () => {
      result = await land.maxSupply();
      result.toString().should.equal("5"); // converting `result` into string as it is in `number`
    });

    it("should return the number of buildings(i.e Land tokenID) available", async () => {
      result = await land.getBuildings();
      result.length.should.equal(5);
    });
  });

  describe("Minting", () => {
    describe("Success", () => {
      beforeEach(async () => {
        // below we are minting a plot of land with an `indexId` or `tokenID` of `1`...
        result = await land.mint(1, { from: owner1, value: COST });
      });

      it("should update the owner address", async () => {
        result = await land.ownerOf(1); // getting this `.ownerOf()` from openzeppelin `ERC721` contract
        result.should.equal(owner1);
      });

      it("should update building details", async () => {
        result = await land.getBuilding(1);
        result.owner.should.equal(owner1);
      });
    });

    describe("Failure", () => {
      it("should prevent mint with 0 value", async () => {
        await land
          .mint(1, { from: owner1, value: 0 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("should prevent mint, with invalid tokenID", async () => {
        await land
          .mint(100, { from: owner1, value: 1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("should prevent minting of tokenID, if it's already owned by an owner", async () => {
        await land.mint(1, { from: owner1, value: COST });
        await land
          .mint(1, { from: owner2, value: COST })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("Transfers", () => {
    describe("success", () => {
      beforeEach(async () => {
        // below we are minting a plot of land with an `indexId` or `tokenID` of `1`...
        await land.mint(1, { from: owner1, value: COST });
        await land.approve(owner2, 1, { from: owner1 }); // approving done by owner1 to owner2
        await land.transferFrom(owner1, owner2, 1, { from: owner2 });
      });

      it("should update the owner address", async () => {
        result = await land.ownerOf(1);
        result.should.equal(owner2);
      });

      it("should update building details", async () => {
        result = await land.getBuilding(1);
        result.owner.should.equal(owner2);
      });
    });

    describe("failure", () => {
      it("should prevent transfer without ownership", async () => {
        await land
          .transferFrom(owner1, owner2, 1, { from: owner2 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("should prevent transfer without approval", async () => {
        await land.mint(1, { from: owner1, value: COST });
        await land
          .transferFrom(owner1, owner2, 1, { from: owner2 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });
});
