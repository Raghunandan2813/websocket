import { createEmitter } from './emitter.js';

export function createClient(url, options = {}) {
  const { reconnect = true, reconnectDelay = 2000, maxReconnectAttempts = 10, onStateChange = () => {} } = options;
  let ws = null, attempts = 0, reconnectTimer = null, destroyed = false;
  const { on, emit } = createEmitter();

  function connect() {
    if (destroyed) return;
    ws = new WebSocket(url);
    onStateChange('connecting');
    ws.addEventListener('open', () => {
      attempts = 0;
      onStateChange('connected');
      emit('open', {});
    });
    ws.addEventListener('message', ({ data }) => {
      try { emit(JSON.parse(data).type, JSON.parse(data)); }
      catch { console.warn('[ws] Could not parse message:', data); }
    });
    ws.addEventListener('close', (event) => {
      onStateChange('disconnected');
      emit('close', { code: event.code, reason: event.reason });
      if (!destroyed && reconnect && attempts < maxReconnectAttempts) {
        attempts++;
        const delay = reconnectDelay * Math.min(attempts, 5);
        onStateChange('reconnecting');
        reconnectTimer = setTimeout(connect, delay);
      }
    });
    ws.addEventListener('error', (err) => emit('error', { error: err }));
  }

  function send(type, payload = {}) {
    if (ws?.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify({ type, payload }));
    return true;
  }

  connect();
  return {
    on, send,
    destroy: () => { destroyed = true; clearTimeout(reconnectTimer); ws?.close(1000); },
    getState: () => ws ? ['connecting', 'connected', 'closing', 'closed'][ws.readyState] : 'idle'
  };
}
