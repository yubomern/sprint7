// socket.worker.js
// Web Worker: runs off the main thread
import { io } from 'socket.io-client';

// Receive config from main thread
let socket = null;

self.onmessage = (e) => {
  const { type, payload } = e.data || {};
  if (type === 'INIT') {
    const { serverUrl, userId } = payload;

    if (socket) socket.disconnect();

    socket = io(serverUrl, {
      transports: ['websocket'],
      auth: { userId }, // matches server handshake
      reconnection: true,
      reconnectionDelay: 500,
    });

    socket.on('connection-user', () => {
      postMessage({ type: 'STATUS', payload: { connected: true, socketId: socket.id } });
    });

    socket.on('disconnect-user', (reason) => {
      postMessage({ type: 'STATUS', payload: { connected: false, reason } });
    });

    socket.on('system', (msg) => {
      postMessage({ type: 'SYSTEM', payload: msg });
    });

    socket.on('notification', (event) => {
      // Forward notifications to UI
      postMessage({ type: 'NOTIFICATION', payload: event });
    });
  }

  if (type === 'CLOSE') {
    if (socket) socket.disconnect();
    socket = null;
  }
};
