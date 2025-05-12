'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/students`);
        const data = await res.json();
        console.log('[AdminStudents] Loaded students:', data);
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/membership-plans`);
        const data = await res.json();
        console.log('[AdminStudents] Fetched plans:', data);
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };

    fetchStudents();
    fetchPlans();
  }, []);

  const handleConvert = async () => {
    if (!selectedStudentId || !selectedPlanId) return;

    const payload = {
      membership_plan_id: selectedPlanId,
    };

    console.log(`[AdminStudents] PATCH /students/${selectedStudentId}/convert`, payload);

    try {
      const res = await fetch(`http://localhost:8080/api/students/${selectedStudentId}/convert`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('✅ Converted to full member!');
        location.reload();
      } else {
        alert('❌ Failed to convert');
      }
    } catch (err) {
      console.error(`Error during conversion:`, err);
    }
  };

  const filtered = students.filter((s: any) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Students</h1>

      <input
        type="text"
        placeholder="Search by name..."
        className="border px-3 py-2 rounded w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Membership</th>
            <th className="border px-2 py-1">Trial Expiry Date</th>
            <th className="border px-2 py-1">Notes</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s: any) => {
            console.log(`[AdminStudents] Rendering student:`, s.full_name, s.trial_status, s.membership_plan_id);
            return (
              <tr key={s.id}>
                <td className="border px-2 py-1">
                  <Link href={`/students/${s.id}/profile`} className="text-blue-600 underline">
                    {s.full_name}
                  </Link>
                </td>
                <td className="border px-2 py-1">{s.email}</td>
                <td className="border px-2 py-1">{s.membership_plans?.name || '—'}</td>
                <td className="border px-2 py-1">
                  {s.membership_plans ? (
                    '—'
                  ) : s.trial_status === 'active' && s.join_date ? (
                    (() => {
                      const expiry = new Date(s.join_date);
                      expiry.setDate(expiry.getDate() + 30);
                      const isExpired = expiry < new Date();
                      return (
                        <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                          {expiry.toLocaleDateString()}
                        </span>
                      );
                    })()
                  ) : (
                    '—'
                  )}
                </td>
                <td className="border px-2 py-1">{s.notes || '—'}</td>
                <td className="border px-2 py-1">
                  {!s.membership_plan_id && s.trial_status === 'active' ? (
                    selectedStudentId === s.id ? (
                      <div className="space-y-1">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Plan</option>
                          {plans.map((p: any) => (
                            <option key={p.id} value={p.id}>
                              ID {p.id} – {p.name}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={handleConvert}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setSelectedStudentId(null)}
                            className="bg-gray-300 px-2 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedStudentId(s.id)}
                        className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                      >
                        Convert to Full
                      </button>
                    )
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
