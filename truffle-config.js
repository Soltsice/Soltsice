module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 5777,
      network_id: "*" // Match any network id
    },
  },
  compilers: {
    solc: {
        version: "0.5.2",
        optimizer: {
          enabled: true,
          runs: 1
        }
      }
  }

};
