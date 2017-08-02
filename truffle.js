module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", 
      gas: 4710000, 
      from: "0x000000000000000"  //testprc main account here
    },
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gas: 471000,
      gasPrice: 220000000,
      from: "0x000000000000000"     //ethereum testnet (ex: ropsten) main account 
    },
    mainnet: {
      host: "localhost",
      port: 8545,
      network_id: 1,
      gas: 4712388,
      from: "0x000000000000000"     //ethereum mainnet main account 
    }
  }
};
