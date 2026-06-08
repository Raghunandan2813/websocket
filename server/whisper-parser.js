function parseWhisper(text) {
  const match = text.match(/^\/(whisper|w)\s+(\S+)\s+(.+)$/i);
  if (!match) return null;
  return { targetName: match[2], msgText: match[3] };
}

module.exports = { parseWhisper };
