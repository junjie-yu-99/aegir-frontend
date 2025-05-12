'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    trialStudents: 0,
    upcomingSessions: [],
    pendingPayments: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      console.log('[AdminDashboard] Fetching stats...');

      try {
        const [studentsRes, trialRes, sessionsRes, paymentsRes] = await Promise.all([
          fetch('http://localhost:8080/api/students'),
          fetch('http://localhost:8080/api/students?trial_status=active'),
          fetch('http://localhost:8080/api/sessions'),
          fetch('http://localhost:8080/api/payments?verified=false'),
        ]);

        console.log('[AdminDashboard] Responses received');

        const [students, trialStudents, sessions, payments] = await Promise.all([
          studentsRes.json(),
          trialRes.json(),
          sessionsRes.json(),
          paymentsRes.json(),
        ]);
        console.log('[AdminDashboard] Full payments data:', payments);
        console.log('[AdminDashboard] Parsed data:');
        console.log('- Students:', students.length);
        console.log('- Trial Students:', trialStudents.length);
        console.log('- Sessions:', sessions.length);
        console.log('- Pending Payments:', payments.length);

        // Filter upcoming sessions
        const upcoming = sessions.filter((s: any) => {
          const now = new Date();
          return new Date(s.date) >= now;
        }).slice(0, 5);

        console.log('[AdminDashboard] Upcoming Sessions:', upcoming.length);

        setStats({
          totalStudents: students.length,
          trialStudents: trialStudents.length,
          upcomingSessions: upcoming,
          pendingPayments: payments.slice(0, 5),
        });

        console.log('[AdminDashboard] Stats updated in state');
      } catch (error) {
        console.error('[AdminDashboard] Error fetching dashboard data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Students" value={stats.totalStudents} />
        <Card label="Trial Students" value={stats.trialStudents} />
        <Card label="Upcoming Sessions" value={stats.upcomingSessions.length} />
        <Card label="Pending Payments" value={stats.pendingPayments.length} />
      </div>

      {/* Upcoming Sessions */}
      <Section title="📅 Upcoming Sessions">
        <ul className="list-disc pl-5 space-y-1">
          {stats.upcomingSessions.map((s: any) => (
            <li key={s.id}>
              <strong>{s.title || 'Untitled'}</strong> – {new Date(s.date).toLocaleDateString()} @{' '}
              {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </li>
          ))}
        </ul>
      </Section>

      {/* Pending Payments */}
      <Section title="💰 Recent Pending Payments">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Student</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Due</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.pendingPayments.map((p: any) => {
              console.log('[Payment Row] Student name:', p.students?.full_name); // ✅ safe place for console log

              return (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.students?.full_name || '—'}</td>
                  <td className="border px-2 py-1">${p.amount}</td>
                  <td className="border px-2 py-1">
                    {p.due_date ? new Date(p.due_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="border px-2 py-1">{p.status}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </Section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
