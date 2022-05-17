const networks = require("../configs/networks.json")

class Network {
  constructor(name = "testnet", version = "alpha") {
    this.name = name
    this.version = version

    const info = require(`../configs/network/${this.name}/${this.version}/index.json`)
    // treat data as properties
    Object.keys(info).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: info[key]
      })
    })
  }

  artifacts(name, type = 'plasma') {
    return require(`../configs/network/${this.name}/${this.version}/artifacts/${type}/${name}.json`)
  }

  abi(name, type = 'plasma') {
    return this.artifacts(name, type).abi
  }
}

Network.networks = networks

module.exports = Network
