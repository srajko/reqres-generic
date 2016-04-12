import assert from 'assert';
import _ from 'lodash';

import { Client, Server } from '..';


const clientSubscriptions = {};
const serverSubscriptions = {};

function addSubscription(subscriptions, message, callback) {
  if (!subscriptions[message]) {
    subscriptions[message] = []; // eslint-disable-line no-param-reassign
  }
  subscriptions[message].push(callback); // eslint-disable-line no-param-reassign
}

function removeSubscription(subscriptions, message, callback) {
  _.remove(subscriptions[message], x => x === callback);
}

function send(subscriptions, message, data) {
  const callbacks = subscriptions[message];
  _.forEach(callbacks, callback => callback(data));
}

function channelConfig(receiveSubscriptions, sendSubscriptions) {
  return {
    send: (message, data) => send(sendSubscriptions, message, data),
    subscribe: (message, callback) => addSubscription(receiveSubscriptions, message, callback),
    unsubscribe: (message, callback) => removeSubscription(receiveSubscriptions, message, callback)
  };
}

class ChannelClient extends Client {
  constructor() {
    super(channelConfig(clientSubscriptions, serverSubscriptions));
  }
}

class ChannelServer extends Server {
  constructor() {
    super(channelConfig(serverSubscriptions, clientSubscriptions));
  }
}

describe('reqres', () => {
  it('can request and respond', () => {
    const server = new ChannelServer();
    const client = new ChannelClient();

    server.on('ping', data => data + 1);
    return client.request('ping', 1)
      .then((response) => {
        assert.equal(response, 2);
      })
      .catch((error) => {
        assert.fail(error);
      });
  });
});
