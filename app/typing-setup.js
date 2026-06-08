import { $ } from './dom.js';

let typingTimeout = null;
let isTyping = false;

export function setupTyping(client) {
  $('msg-input').addEventListener('input', () => {
    if (!isTyping) {
      isTyping = true;
      client.send('typing', { typing: true });
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      isTyping = false;
      client.send('typing', { typing: false });
    }, 1500);
  });
}

export function resetTyping(client) {
  isTyping = false;
  clearTimeout(typingTimeout);
  client.send('typing', { typing: false });
}
