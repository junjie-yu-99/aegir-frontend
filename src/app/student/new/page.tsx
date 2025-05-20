'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface MembershipPlan {
  id: number;
  name: string;
  duration_months: number;
  is_quarterly_plan: boolean;
  age_min_year: number | null;
  age_max_year: number | null;
  monthly_price: number | null;
  quarterly_price: number | null;
  quarterly_price_q4: number | null;
  registration_fee: number | null;
  refundable_deposit: number | null;
}
export default function StudentRegistrationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    phone: '',
    parent_name: '',
    profile_image_url: null,
    notes: '',
    membership_plan_id: ''
  });

  const isQuarterMonth = [0, 3, 6, 9].includes(new Date().getMonth());

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

  useEffect(() => {
  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/membership-plans');
      const data = await res.json();

      const plans: MembershipPlan[] = data.map((p: any) => ({
        ...p,
        monthly_price: p.monthly_price ? parseFloat(p.monthly_price) : null,
        quarterly_price: p.quarterly_price ? parseFloat(p.quarterly_price) : null,
        quarterly_price_q4: p.quarterly_price_q4 ? parseFloat(p.quarterly_price_q4) : null,
        registration_fee: p.registration_fee ? parseFloat(p.registration_fee) : null,
        refundable_deposit: p.refundable_deposit ? parseFloat(p.refundable_deposit) : null,
      }));

      setMembershipPlans(plans);
    } catch (err) {
      console.error('Failed to fetch membership plans:', err);
    }
  };

  fetchPlans();
}, []);

  const formatPrice = (price: number | null | undefined) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  

  if (name === 'dob') {
    const birthYear = new Date(value).getFullYear();

    // Auto-select matching membership plan (monthly by default)
    const matchedPlan = membershipPlans.find(plan => {
      const minOK = plan.age_min_year === null || birthYear >= plan.age_min_year;
      const maxOK = plan.age_max_year === null || birthYear <= plan.age_max_year;
      return minOK && maxOK && plan.duration_months === 1;
    });

    setFormData(prev => ({
      ...prev,
      dob: value,
      membership_plan_id: matchedPlan ? matchedPlan.id.toString() : ''
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
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
          membership_plan_id: formData.membership_plan_id ? parseInt(formData.membership_plan_id) : null,
          full_name: formData.full_name,
          phone: formData.phone,
          parent_name: formData.parent_name,
          profile_image_url: formData.profile_image_url,
          notes: formData.notes
        }),
      });

      if (res.ok) {
        router.push('/student/dashboard');
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

        <select
  name="membership_plan_id"
  className="w-full border p-2 rounded"
  onChange={handleChange}
  value={formData.membership_plan_id}
>
        <option value="">Select Membership Plan (optional)</option>
        {membershipPlans.map(plan => {
          const quarterlyNote = plan.is_quarterly_plan && !isQuarterMonth ? ' — Available in Jan, Apr, Jul, Oct' : '';
          const label = `${plan.name} — ${formatPrice(plan.monthly_price)} / mo, ${formatPrice(plan.quarterly_price)} / qtr${quarterlyNote}`;
          return (
            <option
              key={plan.id}
              value={plan.id}
              disabled={plan.is_quarterly_plan && !isQuarterMonth}
            >
              {label}
            </option>
          );
        })}
      </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}
