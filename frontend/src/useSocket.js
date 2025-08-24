// src/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(userId) {
  const ref = useRef(null);
  useEffect(() => {
    if (!userId) return;
    const s = io('http://localhost:4000', { path: '/socket.io', transports:['websocket'] });
    ref.current = s;
    s.emit('joinUser', userId);
    return () => s.disconnect();
  }, [userId]);
  return ref;
}
