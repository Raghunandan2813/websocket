function parseCommand(text) {
  if (!text || !text.startsWith('/')) return null;
  const parts = text.slice(1).trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  return { cmd, args };
}

module.exports = { parseCommand };
