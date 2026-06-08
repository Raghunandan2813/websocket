import { setupChatEvents } from './events-chat.js';
import { setupModalEvents } from './events-modal.js';
import { setupTyping } from './typing-setup.js';
import { state } from './state.js';

export function setupAll(client, sendChat) {
  setupChatEvents(client, () => state.myUsername, sendChat);
  setupModalEvents(client, () => state.myUsername);
  setupTyping(client);
}
