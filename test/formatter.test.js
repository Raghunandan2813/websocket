const { formatText } = require('../server/formatter');

function runTest() {
  const input = 'Hello :) How are you? <3';
  const expected = 'Hello 🙂 How are you? ❤️';
  const output = formatText(input);
  if (output !== expected) {
    throw new Error(`Test failed: expected "${expected}", got "${output}"`);
  }
  console.log('Formatter unit test passed! ✅');
}

runTest();
