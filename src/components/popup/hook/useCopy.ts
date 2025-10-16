import { useState } from "react";

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState<{ number: boolean; sms: boolean }>({
    number: false,
    sms: false,
  });

  const copy = async (type: "number" | "sms", text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied({ number: false, sms: false });
    }, 1000);
  };

  return { copied, copy };
};
