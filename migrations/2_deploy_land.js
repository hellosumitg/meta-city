/* eslint-disable no-undef */
const Land = artifacts.require("Land");

module.exports = async function (deployer) {
  const NAME = "Buildings";
  const SYMBOL = "BLD";
  const COST = web3.utils.toWei("0.01", "ether"); // coverts 0.01 ether into wei

  await deployer.deploy(Land, NAME, SYMBOL, COST);
};
