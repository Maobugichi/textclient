import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Transaction {
  id: string | number;
  note: string;
  amount: number | string;
  date: string;
  status: 'successful' | 'refunded' | 'pending' | 'failed';
  type?: 'debit' | 'credit';
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { note, amount, date, status, type = 'debit' } = transaction;

  console.log(status)

  const statusConfig = {
    successful: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle2,
      label: 'Successful',
    },
    refunded: {
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: RefreshCw,
      label: 'Refunded',
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Clock,
      label: 'Pending',
    },
    failed: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircle,
      label: 'Failed',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isCredit = type === 'credit' || status === 'refunded';
  const numericAmount = Number(amount) || 0;

  return (
    <div className="group hover:bg-accent/50 transition-colors rounded-lg p-3 md:p-4 cursor-pointer">
      <div className="flex items-center justify-between gap-2">
        {/* Left Section - Icon and Details */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {/* Transaction Type Icon */}
          <div
            className={cn(
              'rounded-full p-1.5 md:p-2.5 flex-shrink-0 transition-transform group-hover:scale-110',
              isCredit ? 'bg-green-100' : 'bg-red-100'
            )}
          >
            {isCredit ? (
              <ArrowDownLeft className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
            )}
          </div>

          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs md:text-sm text-foreground truncate">
              {note}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{date}</p>
          </div>
        </div>

        {/* Right Section - Amount and Status */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-4">
          {/* Amount */}
          <div className="text-right">
            <p
              className={cn(
                'font-semibold text-xs md:text-sm whitespace-nowrap',
                isCredit ? 'text-green-600' : 'text-red-600'
              )}
            >
              {isCredit ? '+' : '-'}₦{Math.abs(numericAmount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Status Badge - Hidden on very small screens, show icon only */}
          <Badge
            variant="outline"
            className={cn('gap-1 md:gap-1.5 font-medium text-[10px] md:text-xs px-1.5 md:px-2 py-0.5', config.color)}
          >
            <StatusIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="hidden sm:inline">{config.label}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

// Main Transactions Component
interface TransactionsListProps {
  transactions: Transaction[];
  initialVisible?: number;
  loadMoreIncrement?: number;
}

const TransactionsList = ({
  transactions,
  initialVisible = 10,
  loadMoreIncrement = 10,
}: TransactionsListProps) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = visibleCount < transactions.length;


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle className="text-lg md:text-xl">Transaction History</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} in total
            </CardDescription>
          </div>

         
        </div>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              No transactions yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {visibleTransactions.map((transaction, index) => (
              <div key={transaction.id || index}>
                <TransactionItem transaction={transaction} />
                {index < visibleTransactions.length - 1 && (
                  <Separator className="my-1" />
                )}
              </div>
            ))}

         
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + loadMoreIncrement)}
                  className="gap-2 text-xs md:text-sm w-full md:w-auto"
                  size="sm"
                >
                  <span>
                    Show More ({transactions.length - visibleCount} left)
                  </span>
                  <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;

