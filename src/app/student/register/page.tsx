import React from "react";
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

const Registration = () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[500px] my-10">
        <CardHeader>
          <CardTitle className="text-center">
            Register for an AEGIR Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input id="name" placeholder="Enter your full name" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" placeholder="Enter your email" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="flex flex-row space-x-2">
                <Checkbox id="trial" />
                <label htmlFor="trial" className="text-xs text-gray-600 ">
                  I want a trial account.
                </label>
              </div>
              <div className="flex flex-col space-y-1.5 text-xs ">
                By ticking this box, you agree to a trail account. This account
                will be activated for 1 month only and will be automatically
                deeted after this period.
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="w-full justify-between flex">
          <Button variant="outline" className="w-2/5">Cancel</Button>
          <Button className="w-2/5">Register</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Registration;
