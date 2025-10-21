import { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useSquadCallback } from '../dashboard/hooks/useUerData';
import { usePendingPayments } from './hook/usePendingPayment';
import { useBalance } from '../../balance';
import { toast } from 'sonner';

interface VerifyPaymentButtonProps {
  transactionRef: string;
  amount: number;
  currency?: string;
}

export const VerifyPaymentButton = ({ 
  transactionRef, 
  
}: VerifyPaymentButtonProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { removePendingPayment } = usePendingPayments();
  const { invalidateBalance } = useBalance();

  const squadCallback = useSquadCallback({
    onSuccess: async () => {
       invalidateBalance();
    },
  });

  console.log(transactionRef)

  const handleVerify = async () => {
    setIsVerifying(true);
    
    try {
      const result = await squadCallback.mutateAsync(transactionRef);
      console.log(result)
      if (result) {
        removePendingPayment(transactionRef);
        if (result.message == "Transaction not successful" || result.message == 'Payment verification failed') {
           toast.error(`${result.message}`);
        } else {
           toast.success(`${result.message}`);
        }
       
      } else {
        toast.info('Payment is still being processed. Please try again in a few moments.');
      }
    } catch (error) {
      console.error('Verification error:', error);
     
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleVerify}
      disabled={isVerifying}
      className="gap-2"
    >
      {isVerifying ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Verify Payment
        </>
      )}
    </Button>
  );
};