module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4710000, 
      from: "0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39"
    },
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gas: 471000,
      gasPrice: 220000000,
      from: "0x38ef4f14eaced72a030c2a3588210b83b0e4944a"
    },
    mainnet: {
      host: "localhost",
      port: 8545,
      network_id: 1,
      gas: 4712388
    }
  }
};
