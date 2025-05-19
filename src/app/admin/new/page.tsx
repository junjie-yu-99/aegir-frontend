'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CoachRegistrationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (isLoaded && user) {
      const syncUser = async () => {
        try {
          await fetch('http://localhost:8080/api/users/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                name: user.fullName,
                role: 'coach', // 🟢
            }),
            });
        } catch (err) {
          console.error('User sync failed:', err);
        } finally {
          setLoading(false);
        }
      };

      syncUser();
    }
  }, [isLoaded, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('http://localhost:8080/api/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          full_name: formData.full_name,
          phone: formData.phone,
        }),
      });

      if (res.ok) {
        router.push('/coach/dashboard'); // ✅ go to coach dashboard
      } else {
        const error = await res.json();
        console.error('Failed to create coach:', error);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-6">Coach Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
