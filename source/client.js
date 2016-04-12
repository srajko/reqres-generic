import uuid from 'uuid';

class Client {
  constructor({ send, subscribe, unsubscribe }) {
    this._send = send;
    this._subscribe = subscribe;
    this._unsubscribe = unsubscribe;
  }

  request(message, data) {
    const id = uuid.v4();

    return new Promise((resolve) => {
      const handler = (response) => {
        this._unsubscribe(id, handler);
        resolve(response);
      };

      this._subscribe(id, handler);
      this._send(message, { id, data });
    });
  }
}

module.exports = Client;
