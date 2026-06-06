import { $ } from './dom.js';

let typingTimeout = null;
let isTyping = false;
const activeTyping = new Map();

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

export function handleTypingUpdate(msg) {
  const { id, username, typing } = msg.payload;
  if (typing) {
    activeTyping.set(id, username);
  } else {
    activeTyping.delete(id);
  }
  updateTypingUI();
}

function updateTypingUI() {
  const names = [...activeTyping.values()];
  const el = $('typing-indicator');
  if (!el) return;
  if (names.length === 0) {
    el.textContent = '';
    el.classList.remove('show');
  } else {
    el.textContent = names.length === 1
      ? `${names[0]} is typing...`
      : `${names.join(', ')} are typing...`;
    el.classList.add('show');
  }
}
