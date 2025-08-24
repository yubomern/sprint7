// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../../mApi/api';
import useSocket from '../../../../useSocket';

export default function TeacherDashboard({ token, user }) {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket(user?.id);

  useEffect(() => {
    apiFetch('/api/dashboard/teacher', { token }).then(setStats).catch(console.error);
    apiFetch('/api/notify/me', { token }).then(setNotifications).catch(console.error);
  }, [token]);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;
    const onNotif = (n) => setNotifications((prev) => [n, ...prev]);
    s.on('notification:new', onNotif);
    return () => s.off('notification:new', onNotif);
  }, [socket]);

  if (!stats) return <div>Chargement…</div>;

  return (
    <div style={{ padding: 16 , background:"grey"}}>
      <h2>Dashboard Enseignant</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <Card title="Followers" value={stats.followersCount} />
        <Card title="Posts" value={stats.postsCount} />
        <Card title="Commentaires" value={stats.totalComments} />
        <Card title="Réclamations ouvertes" value={stats.openReclamations} />
      </div>

      <h3 style={{ marginTop:24 }}>Notifications récentes</h3>
      <ul>
        {notifications.slice(0,8).map((n) => (
          <li key={n._id || n.createdAt}>
            <b>{n.title}</b> — {n.message} <i>({new Date(n.createdAt).toLocaleString()})</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ padding:16, border:'1px solid #e5e7eb', borderRadius:12, background:'#fff' }}>
      <div style={{ fontSize:12, color:'#666' }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:700 }}>{value}</div>
    </div>
  );
}
