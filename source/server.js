class Server {
  constructor({ send, subscribe }) {
    this._send = send;
    this._subscribe = subscribe;
  }

  on(message, callback) {
    this._subscribe(message, ({ id, data }) =>
      Promise.resolve(callback(data))
        .then((result) => {
          this._send(id, result);
        })
    );
  }
}

module.exports = Server;
