module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    test: {
      host: "192.168.1.11",
      port: 8545,
      network_id: "*" // Match any network id
    }

  }
};
