import { $ } from './dom.js';
import { systemMsg } from './ui.js';
import { state } from './state.js';

export const connectionEvents = {
  onStateChange: (s) => {
    $('status-dot').className = s;
    $('status-label').textContent = s;
  },
  onOpen: () => {
    $('msg-input').disabled = false;
    $('btn-send').disabled = false;
  },
  onClose: () => {
    $('msg-input').disabled = true;
    $('btn-send').disabled = true;
    systemMsg($('messages'), 'Disconnected. Reconnecting in 3s…');
  },
  onPingStart: () => { state.pingStart = Date.now(); },
  onPong: () => { $('latency').textContent = `${Date.now() - state.pingStart}ms`; }
};
