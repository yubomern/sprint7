import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { queueNotification } from '../../../services/notifyUser';

// If using Vite:
const workerUrl = new URL('../../../worker/socket.worker.js', import.meta.url);

export default function NotificationsDemo({ userId }) {
  const workerRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);

  // Start worker + socket
  useEffect(() => {
    const worker = new Worker(workerUrl, { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, payload } = e.data || {};
      if (type === 'STATUS') setConnected(!!payload?.connected);
      if (type === 'SYSTEM') {
        // system messages from server
      }
      if (type === 'NOTIFICATION') {
        setEvents((prev) => [...prev, payload]);

        // Optional: show native browser notification if granted
        if (Notification?.permission === 'granted') {
          new Notification(payload.title || 'Notification', { body: payload.body || '' });
        } else {
          // fallback toast
          Swal.fire({
            title: payload.title || 'Notification',
            text: payload.body || '',
            timer: 2000,
            icon: 'info',
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          });
        }
      }
    };

    worker.postMessage({
      type: 'INIT',
      payload: { serverUrl: 'http://localhost:4000', userId },
    });

    return () => {
      worker.postMessage({ type: 'CLOSE' });
      worker.terminate();
    };
  }, [userId]);

  // Ask notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendTest = async () => {
    await queueNotification({
      userId,
      title: 'Hello 👋',
      body: 'This is a test notification from backend worker.',
    });
  };

  return (
    <div  style={{background:"white"}}>
      <h3>Realtime Notifications</h3>
      <div>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <button onClick={sendTest} style={styles.button}>Send test notification</button>

      <div>
        {events.slice().reverse().map((ev, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.title}>{ev.title}</div>
            <div style={styles.body}>{ev.body}</div>
            <div style={styles.time}>{new Date(ev.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  //card: { padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,.08)', maxWidth: 520 },
  button: { marginTop: 12, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#4e54c8', color: '#fff', cursor: 'pointer' },
  list: { marginTop: 16, display: 'grid', gap: 10 },
  item: { border: '1px solid #eee', borderRadius: 10, padding: 10, background: '#fafbff' },
  title: { fontWeight: 700 },
  body: { opacity: .85 },
  time: { fontSize: 12, opacity: .6, textAlign: 'right' },
};
