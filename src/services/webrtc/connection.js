import io from 'socket.io-client' // TODO: add to deps

class Connection {
  constructor (config) {
    this.connection = io.connect(config.server, config.settings)
  }

  on (ev, fn) {
    this.connection.on(ev, fn)
  }

  emit (data) {
    this.connection.emit(data)
  }

  getSessionid () {
    return this.connection.id
  }

  disconnect () {
    this.connection.disconnect()
  }
}

export default Connection
