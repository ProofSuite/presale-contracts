module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", 
      gas: 4710000, 
      from: "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200"  //testprc main account here
    },
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gas: 471000,
      gasPrice: 220000000,
      from: "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200"     //ethereum testnet (ex: ropsten) main account 
    },
    mainnet: {
      host: "localhost",
      port: 8545,
      network_id: 1,
      gas: 4712388,
      from: "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200"     //ethereum mainnet main account 
    }
  }
};
