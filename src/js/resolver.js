const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')

const {default: Resolution} = require('@unstoppabledomains/resolution')

const REGISTRAR_MAIN_NET = "0x314159265dd8dbb310642f98f50c066173c1259b"
const REGISTRAR_ROPSTEN = "0x112234455c3a32fd11230c42e7bccd4a84e02010"

const resolution = new Resolution({blockchain: {
  ens: {url: 'https://mainnet.infura.io/v3/91da3a52af254c758fa6fe292fa7f9fd'},
  cns: {url: 'https://mainnet.infura.io/v3/91da3a52af254c758fa6fe292fa7f9fd'}
}})

var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/91da3a52af254c758fa6fe292fa7f9fd"))

var abi = {
  registrar: JSON.parse(require('../contracts/registrar.js')),
  resolver: JSON.parse(require('../contracts/resolver.js'))
}

module.exports.resolve = function(name) {
  if(name.includes(".zil")) {
    resolution.address(name, "ZIL")
    .then(address => console.log(name, ' resolves to', address))
    .then((contentHash) => {
            console.log("Content hash: " + contentHash)
            if (contentHash) {
              // Remove 0x prefix
              hex = contentHash.substring(2)
              // Convert to buffer
              buf = multihash.fromHexString(hex)
              // Multihash encode and convert to base58
              resolve(multihash.toB58String(multihash.encode(buf, 'sha2-256')))
            } else {
              reject('fisk')
            }
          })

  }else{
        let hash = namehash.hash(name)
        Registrar = new web3.eth.Contract(abi.registrar, REGISTRAR_MAIN_NET)

        return new Promise((resolve, reject) => {
          Registrar.methods.resolver(hash).call()
          .then((address) => {
            if (address === '0x0000000000000000000000000000000000000000') {
              reject(null)
            } else {
              Resolver = new web3.eth.Contract(abi.resolver, address)
              return Resolver.methods.content(hash).call()
            }
          })
          .then((contentHash) => {
            console.log("Content hash: " + contentHash)

            if (contentHash) {
              // Remove 0x prefix
              hex = contentHash.substring(2)
              // Convert to buffer
              buf = multihash.fromHexString(hex)
              // Multihash encode and convert to base58
              resolve(multihash.toB58String(multihash.encode(buf, 'sha2-256')))
            } else {
              reject('fisk')
            }
          })
        })                
  }
}
