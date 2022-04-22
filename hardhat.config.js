require("@nomiclabs/hardhat-web3");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
      version: "0.8.2",
      settings: {
          optimizer: {
              enabled: true,
              runs: 200
          }
      }
  },
  networks: {
      hardhat: {
          chainId: 1337
      },
      localhost: {
          chainId: 1337
      }
  }
};
