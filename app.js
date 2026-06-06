import { $ } from './app/dom.js';
import { addChatMsg, systemMsg } from './app/ui.js';
import { initClient } from './app/client-manager.js';
import { setupEventListeners } from './app/events.js';
import { state } from './app/state.js';
import { connectionEvents } from './app/connection-events.js';
import { chatEvents } from './app/chat-events.js';
import { setupTyping, handleTypingUpdate } from './app/typing.js';

const client = initClient('ws://localhost:8080', {
  ...connectionEvents,
  ...chatEvents,
  onChat: (msg) => addChatMsg($('messages'), msg.payload, state.myId),
  onTyping: handleTypingUpdate,
  onError: (msg) => systemMsg($('messages'), `Error: ${msg.payload.message}`),
});

function sendChat() {
  const text = $('msg-input').value.trim();
  if (text) {
    client.send('chat', { text });
    $('msg-input').value = '';
    client.send('typing', { typing: false });
  }
}

setupEventListeners(client, () => state.myUsername, sendChat);
setupTyping(client);
