export function createClient(url, options = {}) {
  const {
    reconnect = true,
    reconnectDelay = 2000,
    maxReconnectAttempts = 10,
    onStateChange = () => {},
  } = options;

  let ws = null;
  let attempts = 0;
  let reconnectTimer = null;
  let destroyed = false;

  const handlers = new Map();

  function on(type, fn) {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
    return () => handlers.get(type)?.delete(fn);
  }

  function emit(type, data) {
    handlers.get(type)?.forEach((fn) => fn(data));
    handlers.get('*')?.forEach((fn) => fn({ type, ...data }));
  }

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
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        console.warn('[ws] Could not parse message:', data);
        return;
      }
      emit(msg.type, msg);
    });

    ws.addEventListener('close', (event) => {
      onStateChange('disconnected');
      emit('close', { code: event.code, reason: event.reason });

      if (!destroyed && reconnect && attempts < maxReconnectAttempts) {
        attempts++;
        const delay = reconnectDelay * Math.min(attempts, 5);
        console.info(`[ws] Reconnecting in ${delay}ms (attempt ${attempts})`);
        onStateChange('reconnecting');
        reconnectTimer = setTimeout(connect, delay);
      }
    });

    ws.addEventListener('error', (err) => {
      emit('error', { error: err });
    });
  }

  function send(type, payload = {}) {
    if (ws?.readyState !== WebSocket.OPEN) {
      console.warn('[ws] Cannot send — not connected');
      return false;
    }
    ws.send(JSON.stringify({ type, payload }));
    return true;
  }

  function destroy() {
    destroyed = true;
    clearTimeout(reconnectTimer);
    ws?.close(1000, 'Client destroyed');
  }

  function getState() {
    if (!ws) return 'idle';
    return ['connecting', 'connected', 'closing', 'closed'][ws.readyState] ?? 'unknown';
  }

  connect();

  return { on, send, destroy, getState };
}
