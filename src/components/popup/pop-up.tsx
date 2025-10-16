import { ClipboardCheck, CircleCheckBig, Loader2, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { io } from "socket.io-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
} from "../ui/card";
import { Separator } from "@radix-ui/react-separator";
import { toast } from "sonner";

import { useSmsInfo } from "../../hooks/useSmsInfo";
import { useCancelRequest } from "./hook/useCancel";
import { useCopyToClipboard } from "./hook/useCopy";

interface PopProps {
  show?: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  error?: boolean;
  setIsError?: Dispatch<SetStateAction<boolean>>;
  userId?: any;
  email?: string;
  cancel?: boolean;
  setIsCancel?: Dispatch<SetStateAction<boolean>>;
  errorInfo?: any;
}

const PopUp: React.FC<PopProps> = ({
  show,
  setIsShow,
  error,
  setIsError,
  userId,
  email,
  cancel,
  setIsCancel,
  errorInfo,
}) => {
  const numberInfo = useSmsInfo();
  const { copied, copy } = useCopyToClipboard();
  const { mutateAsync: cancelRequest, isPending } = useCancelRequest();
  const [debitRef, setDebitRef] = useState<string>("");

  useEffect(() => {
    const ref = numberInfo?.debitRef
    if (ref) setDebitRef(ref);
  }, [show]);

  useEffect(() => {
    if (cancel && setIsCancel) {
      const timeout = setTimeout(() => setIsCancel(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [cancel]);

  const handleCancel = async () => {
    if (numberInfo.sms !== null) return;
    await cancelRequest({
      request_id: numberInfo.request_id,
      debitref: debitRef,
      user_id: userId,
      email: email || "",
    });

    setIsShow(false);
    const socket = io("https://api.textflex.net");
    socket.emit("client-ready");
    socket.on("notification", (data) => {
      console.log("Notification received:", data);
    });
  };

  const handleCopy = (type: "number" | "sms", value: string) => {
    copy(type, value);
    toast.success(`${type === 'number' ? 'Phone number' : 'SMS code'} copied to clipboard!`);
  };

  const hidePopUp = () => {
    if (cancel) return;
    setIsShow(false);
    setIsError?.(false);
  };

  const hasError = 
    numberInfo?.sms === "❌ Error polling SMS" || 
    numberInfo?.sms === "⏱️ SMS polling timed out, code not sent.";

  const isWaitingForSms = numberInfo?.sms === null;
  const hasSms = numberInfo?.sms && !hasError && !isWaitingForSms;

  return (
    <>
      
      <Dialog open={show && !error} onOpenChange={hidePopUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {hasSms ? (
                <>
                  <CircleCheckBig className="w-5 h-5 text-green-600" />
                  SMS Received
                </>
              ) : (
                <>Waiting for SMS</>
              )}
            </DialogTitle>
            <DialogDescription>
              {hasSms 
                ? "Your verification code has arrived. Click to copy."
                : "We're waiting for your verification SMS to arrive."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Phone Number Card */}
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent 
                className="flex items-center justify-between p-4"
                onClick={() => handleCopy("number", numberInfo?.number)}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-lg font-semibold font-mono">
                    {numberInfo?.purchased_number}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  {copied.number ? (
                    <ClipboardCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </CardContent>
            </Card>

            <Separator />

           
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent 
                className="flex items-center justify-between p-4"
                onClick={() => numberInfo?.sms && handleCopy("sms", numberInfo.sms)}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Verification Code</p>
                  {isWaitingForSms ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-400">Waiting for SMS...</p>
                    </div>
                  ) : hasError ? (
                    <Badge variant="destructive" className="mt-1">
                      {numberInfo.sms}
                    </Badge>
                  ) : (
                    <p className="text-2xl font-bold font-mono text-blue-600">
                      {numberInfo?.sms}
                    </p>
                  )}
                </div>
                {hasSms && (
                  <Button variant="ghost" size="icon">
                    {copied.sms ? (
                      <ClipboardCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            {hasError ? (
              <Button onClick={hidePopUp} className="w-full" variant="destructive">
                Close
              </Button>
            ) : hasSms ? (
              <Button onClick={hidePopUp} className="w-full bg-green-600 hover:bg-green-700">
                <CircleCheckBig className="w-4 h-4 mr-2" />
                Done
              </Button>
            ) : (
              <Button
                onClick={handleCancel}
                disabled={isPending}
                className="w-full"
                variant="outline"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Request"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={error} onOpenChange={hidePopUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <span className="text-2xl">⚠️</span>
              Error Occurred
            </DialogTitle>
            <DialogDescription>
              Something went wrong with your request.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-900">{errorInfo}</p>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button onClick={hidePopUp} className="w-full" variant="destructive">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopUp;