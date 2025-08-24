// src/pages/TeacherPosts.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../../mApi/api';
import { useSelector } from 'react-redux';

export default function TeacherPosts({ token, teacherId }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const  {user}  = useSelector(state =>state.profile);

  //teacherId

  useEffect(() => {
    console.log(user);
    let teacherId = user._id;
    apiFetch(`/api/posts/teacher/${teacherId}`, { token }).then(setPosts);
  }, [teacherId, token]);

  const create = async () => {
    const p = await apiFetch('/api/posts', { token, method:'POST', body:{ text }});
    setPosts([p, ...posts]);
    setText('');
  };

  const comment = async (postId, c) => {
    const p = await apiFetch(`/api/posts/${postId}/comments`, { token, method:'POST', body:{ text:c }});
    setPosts((prev) => prev.map(x => x._id === p._id ? p : x));
  };

  return (
    <div style={{ padding: 16, background:"grey" }}>
      <h3>Publier une mise à jour</h3>
      <div>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} style={{ width:'100%' }} />
        <button onClick={create}>Publier</button>
      </div>

      <h3 style={{ marginTop:24 }}>Mes posts</h3>
      {posts.map(p => (
        <div key={p._id} style={{ border:'1px solid #eee', borderRadius:8, padding:12, marginBottom:12 }}>
          <div><b>{new Date(p.createdAt).toLocaleString()}</b></div>
          <div>{p.text}</div>
          <div style={{ marginTop:8 }}>
            <b>Commentaires</b>
            <ul>
              {p.comments.map(c => (
                <li key={c._id}><b>{c.author?.firstName}:</b> {c.text}</li>
              ))}
            </ul>
            <AddComment onSubmit={(t)=>comment(p._id,t)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AddComment({ onSubmit }) {
  const [val, setVal] = useState('');
  return (
    <div style={{ display:'flex', gap:8, marginTop:8 }}>
      <input value={val} onChange={(e)=>setVal(e.target.value)} placeholder="Votre commentaire…" />
      <button onClick={()=>{ onSubmit(val); setVal(''); }}>Envoyer</button>
    </div>
  );
}
