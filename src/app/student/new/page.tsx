'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function StudentRegistrationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    phone: '',
    parent_name: '',
    profile_image_url: null,
    notes: ''
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to backend
      const syncUser = async () => {
        try {
          await fetch('http://localhost:8080/api/users/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              name: user.fullName,
              role: 'student',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dobISO = new Date(formData.dob).toISOString();

      const res = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          join_date: new Date().toISOString(),
          dob: dobISO,
          trial_status: 'active',
          membership_plan_id: null,
          full_name: formData.full_name,
          phone: formData.phone,
          parent_name: formData.parent_name,
          profile_image_url: formData.profile_image_url,
          notes: formData.notes
        }),
      });

      if (res.ok) {
        router.push('/student/dashboard'); // redirect after success
      } else {
        const error = await res.json();
        console.error('Failed to create student:', error);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-6">Complete Your Student Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="date" name="dob" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="parent_name" placeholder="Parent's Name" className="w-full border p-2 rounded" onChange={handleChange} />
        <textarea name="notes" placeholder="Any notes..." className="w-full border p-2 rounded" onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}
