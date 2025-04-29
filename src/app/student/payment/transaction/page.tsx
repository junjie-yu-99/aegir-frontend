import React from "react";
import { Button, Card, CardContent } from "@/components/ui";

const PaymentTransaction = () => {
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-15 w-full mx-15 my-3">
        <CardContent>
          <form className="flex justify-between gap-9">
            {/* left side */}
            <div className="grid w-1/2 px-8 py-5 items-center gap-8">
              <div className="text-2xl">Complete Your Payment</div>
              <div>
                <ol className="list-decimal px-4 space-y-8 text-base">
                  <li>
                    Scan the QR Code with your banking app to pay{" "}
                    <span className="italic">OR</span> Use the UEN Number:{" "}
                    <span className="text-indigo-600">0012838238193</span>.
                  </li>
                  <li>
                    Amount to Pay{" "}
                    <span className="text-4xl font-bold">$100.00</span>
                  </li>
                  <li>Once done, click “Complete Payment”.</li>
                </ol>
              </div>
            </div>

            <div className="h-auto border-l-2 "></div>

            {/* right side */}
            <div className="flex flex-col w-1/2 p-5 gap-10 my-auto">
              {/* QR Code */}
              <Button className="w-3/4 mx-auto">Complete Payment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTransaction;
