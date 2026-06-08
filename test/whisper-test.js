const { createTestClient } = require('./test-client');

async function testWhisper() {
  console.log('Running whisper tests…\n');
  const alice = await createTestClient('Alice');
  const bob   = await createTestClient('Bob');

  bob.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === 'whisper') {
      console.log(`[Bob Whisper Received] from ${msg.payload.from.username}: "${msg.payload.text}"`);
    }
  });

  await new Promise(r => setTimeout(r, 200));
  alice.send(JSON.stringify({ type: 'chat', payload: { text: '/w Bob Hello Bob, this is a secret!' } }));
  await new Promise(r => setTimeout(r, 500));

  console.log('\nWhisper test complete.');
  alice.close();
  bob.close();
}

testWhisper().catch(console.error);
