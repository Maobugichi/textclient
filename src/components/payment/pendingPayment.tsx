import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { usePendingPayments } from './hook/usePendingPayment';
import { VerifyPaymentButton } from './verifyPaymentBtn';
import { useEffect } from 'react';

export const PendingPaymentsList = () => {
  const { pendingPayments, clearOldPayments } = usePendingPayments();

  console.log(pendingPayments)
  useEffect(() => {
    clearOldPayments();
  }, []); 

  if (pendingPayments.length === 0) {
    return null;
  }

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <Card className="w-full border-yellow-200 dark:text-black dark:bg-white bg-yellow-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-base">Pending Payments</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {pendingPayments.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingPayments.map((payment) => (
          <div
            key={payment.ref}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-yellow-200"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <p className="font-medium text-sm text-foreground">
                  {payment.currency} {payment.amount.toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Ref: {payment.ref}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimestamp(payment.timestamp)}
              </p>
            </div>
            
            <VerifyPaymentButton
              transactionRef={payment.ref}
              amount={payment.amount}
              currency={payment.currency}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};