import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";

const AdminLogin = () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Log In</CardTitle>
          <CardDescription className="text-center">
            <a href="/student/login" className="italic">
              Log in with student account.
            </a>{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="email" placeholder="Enter your password" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="id">Id</Label>
                <Input id="id" placeholder="Enter your id" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="w-full">
          {/* <Button variant="outline">Cancel</Button> */}
          <Button className="w-full">Log In</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
