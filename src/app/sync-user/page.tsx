'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SyncUserPage() {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    const name = user.fullName;

    if (!email || !name) {
      console.log('[SyncUserPage] Waiting for full user object...');
      return; // Don't sync yet
    }

    const syncUser = async () => {
      setStatus('syncing...');
      console.log('[SyncUserPage] Syncing user with:', { id: user.id, email, name });

      try {
        const res = await fetch('http://localhost:8080/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            email,
            name,
            role: 'admin',
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        console.log('[SyncUserPage] Sync successful:', result);
        setStatus('✅ Synced');
      } catch (err) {
        console.error('[SyncUserPage] Sync failed:', err);
        setStatus('❌ Error syncing');
      }
    };

    syncUser();
  }, [isLoaded, user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">User Sync Page</h1>
      <p>Status: {status}</p>
    </div>
  );
}
