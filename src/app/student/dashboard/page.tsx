'use client'

import React, { useState, useEffect } from 'react';
import { Home, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments'>('dashboard');
  const { user } = useUser();
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      console.log('Clerk user:', user);
      fetch(`http://localhost:8080/api/students/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched student:', data);
          setStudentData(data);
        })
        .catch((err) => console.error('Failed to fetch student data:', err));
    }
  }, [user]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Student Panel</h2>
          {user && <p className="text-sm text-gray-600 mt-1">Hi, {user.firstName} 👋</p>}
          {studentData && (
            <p className="text-xs text-gray-500">Membership: {studentData.trial_status ?? 'N/A'}</p>
          )}
        </div>

        <nav className="space-y-2">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left ${
              activeTab === 'dashboard' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={18} />
            Dashboard
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left ${
              activeTab === 'payments' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={18} />
            Payments
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

            {studentData && (
              <section className="bg-white rounded-xl shadow p-5 mb-10">
                <h2 className="text-xl font-semibold mb-2">Your Info</h2>
                <ul className="text-gray-700 list-inside list-disc space-y-1">
                  <li><strong>Full Name:</strong> {studentData.full_name}</li>
                  <li><strong>Email:</strong> {studentData.email || 'N/A'}</li>
                  <li><strong>Phone:</strong> {studentData.phone || 'N/A'}</li>
                  <li><strong>Trial Status:</strong> {studentData.trial_status || 'N/A'}</li>
                  <li><strong>Join Date:</strong> {studentData.join_date?.split('T')[0]}</li>
                </ul>
              </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-xl font-semibold mb-2">Upcoming Sessions</h2>
                <p className="text-gray-500">No upcoming sessions. Check back later!</p>
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-xl font-semibold mb-2">Attendance</h2>
                <p className="text-gray-500">You have attended 0 sessions this month.</p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 mb-10">
              <h2 className="text-xl font-semibold mb-2">Membership Status</h2>
              <p className="text-gray-500">
                {studentData?.trial_status === 'active'
                  ? 'Trial member. Trial expires soon.'
                  : 'Full member.'}
              </p>
            </section>

            <section className="bg-white rounded-xl shadow p-5">
              <h2 className="text-xl font-semibold mb-2">Messages</h2>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Coach Lee: Remember to bring your cap!</li>
                <li>Session on Friday moved to 5PM.</li>
              </ul>
            </section>
          </>
        )}

        {activeTab === 'payments' && (
          <section className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <button
                onClick={() => router.push('/student/payment')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Make Payment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 text-gray-800">2024-05-01</td>
                    <td className="px-4 py-2 text-gray-800">S$120.00</td>
                    <td className="px-4 py-2 text-green-600 font-medium">Paid</td>
                    <td className="px-4 py-2 text-gray-800">U12 Monthly</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-800">2024-04-01</td>
                    <td className="px-4 py-2 text-gray-800">S$120.00</td>
                    <td className="px-4 py-2 text-green-600 font-medium">Paid</td>
                    <td className="px-4 py-2 text-gray-800">U12 Monthly</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
