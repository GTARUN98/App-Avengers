// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   solidity: "0.8.4",
//   paths: {
//     artifacts: "./src/backend/artifacts",
//     sources: "./src/backend/contracts",
//     cache: "./src/backend/cache",
//     tests: "./src/backend/test"
//   },
// };


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
  //changed the hardhat.config.js file to connect it to metamak and alchemy

  require("dotenv").config({path:"./.env"});
  require("@nomiclabs/hardhat-ethers");
  // const { API_URL, PRIVATE_KEY } = process.env;
  const API_URL = "https://sepolia.infura.io/v3/8947f442c1af41d39942b4604b5f67b4";
  const PRIVATE_KEY = "1e18d5244181215da6338346b2859d28cad28e3945f8d66940f7833eded31614";
  module.exports = {
    solidity: "0.8.20",
    paths: {
          artifacts: "./src/backend/artifacts",
          sources: "./src/backend/contracts",
          cache: "./src/backend/cache",
          tests: "./src/backend/test"
        },
    defaultNetwork: "sepolia",
    networks: {
      hardhat: {},
      sepolia: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
        gas: 2100000,
        gasPrice: 8000000000,
      },
    },
  };
