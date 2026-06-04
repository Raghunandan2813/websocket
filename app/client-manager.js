import { createClient } from '../client/client.js';

export function initClient(url, handlers) {
  let pingInterval = null;
  const client = createClient(url, {
    reconnect: true,
    onStateChange: handlers.onStateChange,
  });

  client.on('open', () => {
    handlers.onOpen();
    pingInterval = setInterval(() => {
      handlers.onPingStart();
      client.send('ping', {});
    }, 5000);
  });

  client.on('close', () => {
    clearInterval(pingInterval);
    handlers.onClose();
  });

  client.on('welcome', handlers.onWelcome);
  client.on('chat', handlers.onChat);
  client.on('user_joined', handlers.onUserJoined);
  client.on('user_left', handlers.onUserLeft);
  client.on('username_changed', handlers.onUsernameChanged);
  client.on('pong', handlers.onPong);
  client.on('error', handlers.onError);

  return client;
}
