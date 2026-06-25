const jokes = [
  "Why do programmers wear glasses? Because they can't C#.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem."
];

function getRandomJoke() {
  const idx = Math.floor(Math.random() * jokes.length);
  return jokes[idx];
}

module.exports = { joke: getRandomJoke };
