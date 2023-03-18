const AWS = require('aws-sdk')
// const redis = require('async-redis')

const defaultParticipants = {
  bot: {
    name: 'BOT',
    nickColor: '#2D46C9',
    id: 'bot'
  }
}

class MemoryDB {
  dataStore = {
    participants: JSON.stringify(defaultParticipants)
  };

  constructor() {}

  set(key, data) {
    this.dataStore[key] = data;
    return data;
  }

  get(key) {
    return this.dataStore[key] || '';
  }
}

class Connection {
  defaultKey = 'participants';
  connections = {}

  constructor (params = {}) {
    this.host = host
    this.port = parseInt(port)
  }

  init (event) {
    // console.log('Conectando com redis')
    // this.client = redis.createClient({
    //   host: this.host,
    //   port: this.port,
    //   tls: {}
    // })
    
    // console.log('Redis connected', this.client)
    // this.client.on('error', err => console.log('Redis Client Error', err));
    // this.client.on('connect', () => console.log('Connected to REDIS'));
    // this.client.on('ready', () => console.log('REDIS Ready'));
    // this.client.on('end', () => console.log('REDIS ended'));

    this.client = new MemoryDB()

    this.gateway = new AWS.ApiGatewayManagementApi({
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    })
  }

  async addConnection(connectionId, data) {
    const participants = await this.getConnections();
    participants[connectionId] = data
    await this.client.set(this.defaultKey, JSON.stringify(participants));
    return participants;
  }

  async removeConnection (connectionId) {
    const participants = await this.getConnections();
    delete participants[connectionId];
    await this.client.set(this.defaultKey, JSON.stringify(participants));
    return participants;
  }

  async getConnections () {
    const data = await this.client.get(this.defaultKey)
    console.log(data, typeof data)
    const connections = JSON.parse(data)
    this.connections = connections;
    return connections;
  }

  async publish (connectionId, message = {}) {
    try {
      await this.gateway.postToConnection({ ConnectionId: connectionId, Data: Buffer.from(JSON.stringify(message)) }).promise()
    } catch (e) {
      console.log('err oub', e)
      // await this.removeConnection(connectionId)
    }
    // this.client.quit()
  }

  async publishToAll (event, message = null) {
    if (!message) message = event.body
    const connections = await this.getConnections()

    const allPromisses = Object.keys(connections).map(connectionId => this.publish(connectionId, message))
    // this.client.quit()
    return Promise.all(allPromisses);
  }

  async sendListMembers () {
    const connections = await this.getConnections()
    const participants = Object.keys(connections).map(connectionId => connections[connectionId])
    const all = Object.keys(connections).map(connectionId => this.publish(connectionId, {members: participants}));
    return Promise.all(all);
  }
}

module.exports = Connection