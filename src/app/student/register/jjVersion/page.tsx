'use client';

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Checkbox,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const RegisterStudent = () => {
  const router = useRouter();
  const { user } = useUser();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [parentName, setParentName] = useState('');
  const [trial, setTrial] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill email from Clerk
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      full_name: fullName,
      email,
      phone,
      dob: dob ? new Date(dob).toISOString() : null,
      parent_name: parentName,
      profile_image_url: null,
      membership_plan_id: null,
      trial_status: trial ? 'active' : 'inactive',
      join_date: new Date().toISOString(),
      notes: notes || null,
    };

    try {
      const res = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to register student');

      console.log('[RegisterStudent] Student registered');
      router.push('/student/dashboard'); // redirect on success to the student dashboard
    } catch (err) {
      console.error('[RegisterStudent] Registration failed:', err);
      alert('Failed to register student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[500px] my-10">
        <CardHeader>
          <CardTitle className="text-center">Register as a Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="parentName">Parent/Guardian Name</Label>
                <Input
                  id="parentName"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="min-h-[100px] p-2 border rounded-md border-gray-300 resize-y"
                  placeholder="Add any relevant notes here (e.g. allergies, swimming level, etc.)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trial"
                  checked={trial}
                  onCheckedChange={() => setTrial(!trial)}
                />
                <label htmlFor="trial" className="text-sm text-gray-600">
                  I want a trial account (1 month).
                </label>
              </div>
            </div>

            <CardFooter className="mt-6 justify-between">
              <Button type="button" variant="outline" className="w-2/5" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="w-2/5" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterStudent;
