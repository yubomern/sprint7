// src/components/FollowButton.jsx
import React, { useState } from 'react';
import { apiFetch } from '../../mApi/api';

export default function FollowButton({ token, teacherId, initiallyFollowing=false }) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const toggle = async () => {
    if (following) {
      await apiFetch('/api/follow/unfollow', { token, method:'POST', body:{ teacherId }});
      setFollowing(false);
    } else {
      await apiFetch('/api/follow', { token, method:'POST', body:{ teacherId }});
      setFollowing(true);
    }
  };
  return (
    <button onClick={toggle}>
      {following ? 'Unfollow' : 'Follow'}
    </button>
  );
}
