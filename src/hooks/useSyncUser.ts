"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface SyncUserResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  const syncUser = async (): Promise<void> => {
    // Don't proceed if user isn't loaded yet or no user is logged in
    if (!isLoaded || !user) return;

    // Don't proceed if we don't have necessary data
    const email = user.primaryEmailAddress?.emailAddress;
    const name = user.fullName;
    if (!email || !name) {
      console.log('[useSyncUser] Waiting for full user object...');
      return;
    }

    // Don't re-sync if we already synced in the last minute (prevent duplicates)
    if (lastSyncTime && Date.now() - lastSyncTime < 60000) {
      console.log('[useSyncUser] Skipping sync - already synced recently');
      return;
    }

    setSyncStatus('syncing');
    console.log('[useSyncUser] Syncing user with:', { id: user.id, email, name });

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
          role: 'admin', // You might want to make this configurable
        }),
      });

      const result = await res.json() as SyncUserResponse;
      if (!res.ok) throw new Error(result.message);

      console.log('[useSyncUser] Sync successful:', result);
      setSyncStatus('success');
      setLastSyncTime(Date.now());
    } catch (err) {
      console.error('[useSyncUser] Sync failed:', err);
      setSyncStatus('error');
    }
  };

  // Automatically sync when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      syncUser();
    }
  }, [isLoaded, user?.id]);

  return { syncStatus, syncUser };
}