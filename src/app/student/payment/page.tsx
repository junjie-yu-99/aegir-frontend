import React from "react";
import { Button, Card, CardContent, Input, Label, Checkbox } from "@/components/ui";

const PaymentDetails = () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className=" p-10 w-full mx-15 my-3">
        <CardContent>
          <form className="flex justify-between gap-9">
            {/* left side */}
            <div className="grid w-1/2 px-8 py-5 items-center gap-6">
              <div className="text-2xl text-gray-600">
                Payment For: {" "}
                <span className="text-black">Match With Team A</span>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Enter Your Email*</Label>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  required
                  className="bg-stone-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="age">Age Bracket</Label>
                <Input id="age" disabled className="bg-stone-100" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="membership">Membership Type</Label>
                <Input id="membership" disabled className="bg-stone-100" />
              </div>
              <div className="flex space-x-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-xs text-gray-600 ">
                  By checking this box, you agree to the payment terms and
                  confirm the payment process.
                </label>
              </div>
              <div className="text-xs font-medium text-red-700">
                Please confirm that all information is correct before proceeding
                to payment.
              </div>
            </div>

            <div className="h-auto border-l-2 "></div>

            {/* right side */}
            <div className="flex flex-col w-1/2 p-5 gap-10 my-auto">
              <div className="text-center text-2xl">
                You are paying <br />
                <span className="text-6xl font-bold">$100.00</span>
                <br />
                to AEGIR.Co
              </div>
              <Button className="w-3/4 mx-auto">Proceed to Make Payment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
