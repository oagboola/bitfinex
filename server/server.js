const { PeerRPCServer }  = require('grenache-nodejs-http')
const Orderbook = require('./Orderbook')
const Link = require('grenache-nodejs-link')
const { connect } = require('http2')


const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

let currentInstances = [];

const service = peer.transport('server')
service.listen(1337)

setInterval(function () {
  link.announce('rpc_test', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  const matchingInstance = connectWithInstance(payload);
  matchingInstance.submit(payload.order)
  matchingInstance.distributeOrder(currentInstances)
  handler.reply(null, { msg: 'world' })
})

// Takes in a payload and determines if the payload is coming from a client that already has an instance
// Creates a new instance if an instance doesn't already exist for the client
function connectWithInstance(payload) {
  let matchingInstance = currentInstances.find(instance => instance.name == payload.name);
  if(!matchingInstance) {
    matchingInstance = new Orderbook(payload.name);
    currentInstances.push(matchingInstance)
  }
  return matchingInstance
}
