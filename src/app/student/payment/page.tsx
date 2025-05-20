'use client'

import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Input, Label, Checkbox } from "@/components/ui";
import { useUser } from '@clerk/nextjs';

const PaymentDetails = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<{
    email: string;
    membershipType: string;
    ageBracket: string;
    amount: number;
  } | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchStudentInfo = async () => {
      try {
        console.log("Clerk user ID:", user.id);

        const res = await fetch(`http://localhost:8080/api/students/user/${user.id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load student data');
        }

        const student = await res.json();
        console.log("Fetched student:", student);

        setStudentData({
          email: student.email || user.emailAddresses[0]?.emailAddress || 'N/A',
          membershipType: student.membership_plans?.name || 'N/A',
          ageBracket: student.age_bracket || 'N/A',
          amount: (student.membership_plans?.price || 0) / 100,
        });
      } catch (err: any) {
        console.error('Error fetching student data:', err);
        setError('Unable to load your payment info. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading payment info...
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-10 w-full max-w-md mx-auto">
          <CardContent>
            <div className="text-red-600 text-center">
              <p className="mb-4">{error || 'Could not load payment information'}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-10 w-full mx-15 my-3">
        <CardContent>
          <form className="flex justify-between gap-9">
            {/* Left side */}
            <div className="grid w-1/2 px-8 py-5 items-center gap-6">
              <div className="text-2xl text-gray-600">
                Payment For: <span className="text-black">Membership Plan</span>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={studentData.email}
                  disabled
                  className="bg-stone-100"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="age">Age Bracket</Label>
                <Input
                  id="age"
                  value={studentData.ageBracket}
                  disabled
                  className="bg-stone-100"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="membership">Membership Type</Label>
                <Input
                  id="membership"
                  value={studentData.membershipType}
                  disabled
                  className="bg-stone-100"
                />
              </div>

              <div className="flex space-x-3">
                <Checkbox id="terms" checked={agreed} onCheckedChange={() => setAgreed(!agreed)} />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  By checking this box, you agree to the payment terms and confirm the payment process.
                </label>
              </div>

              <div className="text-xs font-medium text-red-700">
                Please confirm that all information is correct before proceeding to payment.
              </div>
            </div>

            <div className="h-auto border-l-2"></div>

            {/* Right side */}
            <div className="flex flex-col w-1/2 p-5 gap-10 my-auto">
              <div className="text-center text-2xl">
                You are paying <br />
                <span className="text-6xl font-bold">S${studentData.amount.toFixed(2)}</span>
                <br />
                to AEGIR.Co
              </div>
              <Button
                className="w-3/4 mx-auto"
                disabled={!agreed}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Proceeding to payment... (hook up your logic here)');
                }}
              >
                Proceed to Make Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
