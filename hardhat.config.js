

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
  //changed the hardhat.config.js file to connect it to metamak and alchemy

  require("dotenv").config({path:"./.env"});
  require("@nomiclabs/hardhat-ethers");
  const { API_URL, PRIVATE_KEY } = process.env;

  module.exports = {
    solidity: "0.8.20",
    paths: {
          artifacts: "./src/backend/artifacts",
          sources: "./src/backend/contracts",
          cache: "./src/backend/cache",
          tests: "./src/backend/test"
        },
    defaultNetwork: "sepolia",//here ia m using sepolia coz i only had test ether in sepolia test network 
    networks: {
      hardhat: {},
      sepolia: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],//of the metamask account used in the .env file
        gas: 2100000,
        gasPrice: 8000000000,
        gasLimit: 5000000,//else error while interacting with the smart contract not enough gas
      },
      // allowUnlimitedContractSize: true
    },
  };
