//to be researched and figured out using clerk's authorisation token
// 'use client';

// import { useEffect, useState } from 'react';

// export default function StudentDashboard() {
//   const [data, setData] = useState({
//     student: null,
//     upcomingSessions: [],
//     payments: [],
//   });

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       console.log('[StudentDashboard] Fetching data...');

//       try {
//         const [studentRes, sessionsRes, paymentsRes] = await Promise.all([
//           fetch('http://localhost:8080/api/students/me'),
//           fetch('http://localhost:8080/api/sessions'),
//           fetch('http://localhost:8080/api/payments/me'),
//         ]);

//         const [student, sessions, payments] = await Promise.all([
//           studentRes.json(),
//           sessionsRes.json(),
//           paymentsRes.json(),
//         ]);

//         const now = new Date();
//         const upcoming = sessions
//           .filter((s: any) => new Date(s.date) >= now)
//           .slice(0, 5);

//         setData({
//           student,
//           upcomingSessions: upcoming,
//           payments: payments.slice(0, 5),
//         });

//         console.log('[StudentDashboard] Data loaded');
//       } catch (error) {
//         console.error('[StudentDashboard] Error:', error);
//       }
//     };

//     fetchStudentData();
//   }, []);

//   const { student, upcomingSessions, payments } = data;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Student Dashboard</h1>

//       {/* Profile Card */}
//       {student && (
//         <Card>
//           <CardHeader title="👤 Profile" />
//           <CardContent>
//             <p><strong>Name:</strong> {student.full_name}</p>
//             <p><strong>Email:</strong> {student.email}</p>
//             <p><strong>Phone:</strong> {student.phone}</p>
//             <p><strong>Trial Status:</strong> {student.trial_status || 'N/A'}</p>
//             <p><strong>Joined:</strong> {new Date(student.join_date).toLocaleDateString()}</p>
//             {student.notes && <p><strong>Notes:</strong> {student.notes}</p>}
//           </CardContent>
//         </Card>
//       )}

//       {/* Upcoming Sessions */}
//       <Section title="📅 Upcoming Sessions">
//         <ul className="list-disc pl-5 space-y-1">
//           {upcomingSessions.map((s: any) => (
//             <li key={s.id}>
//               <strong>{s.title || 'Untitled'}</strong> – {new Date(s.date).toLocaleDateString()} @{' '}
//               {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </li>
//           ))}
//         </ul>
//         {upcomingSessions.length === 0 && <p>No upcoming sessions.</p>}
//       </Section>

//       {/* Payments */}
//       <Section title="💰 Recent Payments">
//         <table className="w-full text-sm border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-2 py-1">Amount</th>
//               <th className="border px-2 py-1">Due</th>
//               <th className="border px-2 py-1">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((p: any) => (
//               <tr key={p.id}>
//                 <td className="border px-2 py-1">${p.amount}</td>
//                 <td className="border px-2 py-1">{p.due_date ? new Date(p.due_date).toLocaleDateString() : '—'}</td>
//                 <td className="border px-2 py-1">{p.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {payments.length === 0 && <p className="mt-2 text-gray-500">No payments found.</p>}
//       </Section>
//     </div>
//   );
// }

// function Card({ children }: { children: React.ReactNode }) {
//   return <div className="bg-white shadow rounded p-4 space-y-2">{children}</div>;
// }

// function CardHeader({ title }: { title: string }) {
//   return <h2 className="text-lg font-semibold">{title}</h2>;
// }

// function CardContent({ children }: { children: React.ReactNode }) {
//   return <div className="space-y-1">{children}</div>;
// }

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">{title}</h2>
//       {children}
//     </div>
//   );
// }
