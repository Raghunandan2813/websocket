export function createEmitter() {
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

  return { on, emit };
}
