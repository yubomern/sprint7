// services/notifyApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:4000';

export async function queueNotification({ userId, title, body, kind = 'in-app', meta = {} }) {
  const { data } = await axios.post(`${API_BASE}/api/notify`, {
    userId,
    payload: { title, body, kind, meta },
  });
  return data;
}
