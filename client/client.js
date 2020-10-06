const { time } = require('console')
const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const payload = [
  {
    msg: 'hello',
    name: 'Ozark',
    order: {
      id: 'dfw9w3j3nds',
      time: Date.now(),
      details: {
        amount: 30,
        content: 'apples'
      }
    }
  },
  {
    msg: 'hello',
    name: 'Ozark',
    order: {
      id: 'dfw9w3j3nds',
      time: Date.now(),
      details: {
        amount: 30,
        content: 'apples',
        txy: 'mango'
      }
    }
  },
  {
    msg: 'Hi',
    name: 'Greenleaf',
    order: {
      id: 'lsdjf8f3ind',
      time: Date.now(),
      details: {
        amount: 40,
        content: 'bananas'
      }
    }
  },
  {
    msg: 'Hiya',
    name: 'Power',
    order: {
      id: 'skjdh78823bdb',
      time: Date.now(),
      details: {
        amount: 20,
        content: 'carrots'
      }
    }
  }
]

function makeRequest() {
  peer.request('rpc_test', payload[Math.floor(Math.random() * payload.length)], { timeout: 10000 }, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log(data) // { msg: 'world' }
  })
}

setInterval(() => {
  makeRequest()
}, 3000);

