import uuid from 'uuid';

class Client {
  constructor({ send, subscribe }) {
    this._send = send;
    this._subscribe = subscribe;
  }

  request(message, data) {
    const id = uuid.v4();

    return new Promise((resolve) => {
      const { unsubscribe } = this._subscribe(id, (response) => {
        unsubscribe();
        resolve(response);
      });
      this._send(message, { id, data });
    });
  }
}

module.exports = Client;
