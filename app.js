import { $ } from './app/dom.js';
import { addChatMsg, addWhisperMsg, systemMsg } from './app/ui-msg.js';
import { initClient } from './app/client-manager.js';
import { state } from './app/state.js';
import { connectionEvents } from './app/connection-events.js';
import { chatEvents } from './app/chat-events.js';
import { resetTyping } from './app/typing-setup.js';
import { handleTypingUpdate } from './app/typing-ui.js';
import { setupAll } from './app/setup.js';

const client = initClient('ws://localhost:8080', {
  ...connectionEvents, ...chatEvents,
  onChat: (m) => addChatMsg($('messages'), m.payload, state.myId),
  onWhisper: (m) => addWhisperMsg($('messages'), m.payload, state.myId),
  onTyping: handleTypingUpdate,
  onError: (m) => systemMsg($('messages'), `Error: ${m.payload.message}`),
});

setupAll(client, () => {
  const text = $('msg-input').value.trim();
  if (text) { client.send('chat', { text }); $('msg-input').value = ''; resetTyping(client); }
});
