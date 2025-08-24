// notificationWorker.js
const { parentPort } = require('worker_threads');

/**
 * Simple notification "processor".
 * In real life, you might look up user prefs, fan-out to email/SMS, etc.
 */
parentPort.on('message', async (msg) => {
  if (msg?.type === 'NOTIFY') {
    const { jobId, userId, payload } = msg;

    // Simulate async work
    await new Promise(r => setTimeout(r, 300));

    // Build a normalized event
    const event = {
      jobId,
      userId,
      kind: payload.kind || 'in-app',
      title: payload.title || 'Notification',
      body: payload.body || '',
      meta: payload.meta || {},
      createdAt: new Date().toISOString(),
    };

    // Send back to main thread
    parentPort.postMessage({ ok: true, jobId, userId, event });
  }
});
