import React from "react";
import { Button, Card, CardContent, Input, Label } from "@/components/ui";
import DatePicker from "@/components/DatePicker";

const CreateSession = async () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className=" p-10 w-full mx-15 my-3">
        <CardContent>
          <form className="flex flex-col justify-between gap-4 px-8 py-2 ">
            <div className="text-2xl text-gray-600">Create Session </div>

            <div className="flex flex-row gap-17">
              {/* left side */}
              <div className="grid w-1/2 items-center gap-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="date">Date*</Label>
                  {/* <DatePicker /> */}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="time">Time*</Label>
                  {/* Time Picker */}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="coach">Coach(s)*</Label>
                  {/* Coach */}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location">Location*</Label>
                  <Input
                    id="location"
                    placeholder="Enter a location"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="frequency">Frequency*</Label>
                  {/* FRequency */}
                </div>
              </div>

              {/* right side */}
              <div className="items-center grid  w-1/2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="duration">Duration*</Label>
                  {/* Duration */}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Amount (per session)*</Label>
                  <Input
                    id="amount"
                    placeholder="Enter an amount"
                    required
                    type="number"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="payment">Payment Method(s)</Label>
                  {/* FRequency */}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Input id="notes" />
                </div>

                <div className="flex justify-between space-x-4">
                  <Button variant="outline" className="w-2/5">
                    Cancel
                  </Button>
                  <Button className="w-2/5">Save</Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSession;
