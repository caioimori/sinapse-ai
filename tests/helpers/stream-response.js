'use strict';

const { ReadableStream } = require('node:stream/web');

// Model fetch's byte stream; calling json() would bypass the production byte cap.
function streamResponse(value, { chunks, headers, hanging = false } = {}) {
  const bytes = chunks || [Buffer.from(JSON.stringify(value), 'utf8')];
  const body = new ReadableStream({
    start(controller) {
      if (hanging) return;
      for (const chunk of bytes) controller.enqueue(chunk);
      controller.close();
    },
  });
  const response = new Response(body, { status: 200, headers });
  response.json = () => { throw new Error('Fixture json() bypassed the bounded response stream'); };
  return response;
}

module.exports = { streamResponse };
