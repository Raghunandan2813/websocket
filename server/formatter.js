const emojiMap = {
  ':)': '🙂',
  ':D': '😀',
  ':(': '🙁',
  '<3': '❤️'
};

function formatText(text) {
  if (!text) return '';
  let formatted = text;
  for (const [key, value] of Object.entries(emojiMap)) {
    formatted = formatted.replaceAll(key, value);
  }
  return formatted;
}

module.exports = { formatText };
