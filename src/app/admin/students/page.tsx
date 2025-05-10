'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      console.log('[AdminStudents] Fetching students...');
      try {
        const res = await fetch(`http://localhost:8080/api/students`);
        const data = await res.json();
        console.log(`[AdminStudents] Loaded ${data.length} students.`);
        setStudents(data);
      } catch (err) {
        console.error('[AdminStudents] Failed to fetch students:', err);
      }
    };

    fetchStudents();
  }, []);

  const filtered = students.filter((s: any) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConvert = async (id: number) => {
    console.log(`[AdminStudents] Converting student ID ${id} to full member...`);
    try {
      const res = await fetch(`http://localhost:8080/api/students/${id}/convert`, {
        method: 'PATCH',
      });

      if (res.ok) {
        console.log(`[AdminStudents] Student ID ${id} successfully converted.`);
        alert('✅ Converted to full member!');
        location.reload(); // simple refresh
      } else {
        console.error(`[AdminStudents] Failed to convert student ID ${id}`);
        alert('❌ Failed to convert');
      }
    } catch (err) {
      console.error(`[AdminStudents] Error during conversion for ID ${id}:`, err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Students</h1>

      <input
        type="text"
        placeholder="Search by name..."
        className="border px-3 py-2 rounded w-full md:w-1/2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          console.log('[AdminStudents] Search updated:', e.target.value);
        }}
      />

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Membership</th>
            <th className="border px-2 py-1">Trial Expiry</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s: any) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">
                <Link href={`/students/${s.id}/profile`} className="text-blue-600 underline">
                  {s.full_name}
                </Link>
              </td>
              <td className="border px-2 py-1">{s.email}</td>
              <td className="border px-2 py-1">{s.membership_status || '—'}</td>
              <td className="border px-2 py-1">
                {s.trial_expiry ? new Date(s.trial_expiry).toLocaleDateString() : '—'}
              </td>
              <td className="border px-2 py-1">
                {s.membership_status === 'trial' ? (
                  <button
                    onClick={() => handleConvert(s.id)}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Convert to Full
                  </button>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
