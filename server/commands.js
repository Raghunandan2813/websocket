const startTime = Date.now();
const { joke } = require('./commands/joke');

const commands = {
  help: () => 'Available commands: /help, /uptime, /roll, /joke',
  uptime: () => {
    const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
    return `Server uptime: ${uptimeSec}s`;
  },
  roll: () => `rolled a ${Math.floor(Math.random() * 6) + 1} 🎲`,
  joke: () => `told a joke: ${joke()}`
};

function executeCommand(cmd, sender) {
  const handler = commands[cmd];
  if (!handler) return `Unknown command: /${cmd}. Type /help for commands.`;
  const result = handler();
  if (['roll', 'joke'].includes(cmd)) return `${sender.username} ${result}`;
  return result;
}

module.exports = { executeCommand };
