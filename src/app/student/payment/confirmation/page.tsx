import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Button, Card, CardContent } from "@/components/ui";

const PaymentConfirmation = () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-15 w-full mx-15 my-3">
        <CardContent className="flex justify-center items-center flex-col gap-7">
          <IoMdCheckmarkCircleOutline size={170} color="green" />
          <div className="text-center">
            A notification email has been sent.
            <br />
            Your receipt will be sent to you within 3 to 5 working days once the
            payment is confirmed.
            <br /> We appreciate your business, thank you!
          </div>
          <Button className="w-1/3 mx-auto bg-stone-400">Back to Home</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
