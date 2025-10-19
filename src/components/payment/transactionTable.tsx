import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Filters from "../filter";
import { getTime } from "../../action";
import { useTransactionFilter } from "./hook/useGetTransations";
import { useState } from "react";


interface TransactionsListProps {
  userId: string | undefined | null;
}

const statusConfig = {
  successful: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
    label: "Successful",
  },
  refunded: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: RefreshCw,
    label: "Refunded",
  },
  pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    label: "Pending",
  },
  failed: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    label: "Failed",
  },
};

export default function TransactionsList({ userId }: TransactionsListProps) {
  const {
    filteredTransactions,
    visibleTransactions,
    visibleCount,
    setVisibleCount,
    filterStatus,
    handleFilter,
    clearFilter,
    isLoading,
  } = useTransactionFilter(userId);

  const [open, setOpen] = useState(false);

  // Handler for filter clicks
  const onFilterClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.currentTarget.textContent?.toLowerCase();
    
    if (target === 'clear' || target === 'all') {
      clearFilter();
    } else if (target && ['successful', 'refunded', 'pending', 'failed'].includes(target)) {
      handleFilter(target as any);
    }
    
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="py-12">
          <div className="flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Recent Activities
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {filteredTransactions.length} total transactions
            {filterStatus !== "all" && (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {filterStatus}
              </Badge>
            )}
          </CardDescription>
        </div>

        <div className="relative md:w-auto w-full flex justify-end">
          <Filters
            handleClick={onFilterClick}
            open={open}
            right="left-0"
          />
        </div>
      </CardHeader>

      <CardContent>
        {visibleTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">
              <Clock className="w-full h-full" />
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
            {visibleTransactions.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.failed;
              const StatusIcon = config.icon;
              const date = getTime(item);
              
              // Determine transaction type based on note and status
              const isDeposit = item.note?.toLowerCase().includes('deposit') && item.status === "successful";
              const isRefund = item.status === "refunded";
              const isCredit = isDeposit; // Only deposits are credits (green with +)
              
              const numericAmount = Number(item.amount) || 0;

              return (
                <div
                  key={item.id || index}
                  className="group hover:bg-accent/50 transition-colors rounded-lg p-3 md:p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "rounded-full p-2 flex-shrink-0 transition-transform group-hover:scale-110",
                          isDeposit ? "bg-green-100" : 
                          isRefund ? "bg-orange-100" : 
                          "bg-red-100"
                        )}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : isRefund ? (
                          <RefreshCw className="h-4 w-4 text-orange-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm text-foreground truncate">
                          {item.note}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                          {date}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-3">
                      <p
                        className={cn(
                          "font-semibold text-xs md:text-sm whitespace-nowrap",
                          isDeposit ? "text-green-600" : 
                          isRefund ? "text-orange-600" : 
                          "text-red-600"
                        )}
                      >
                        {isCredit ? "+" : "-"}₦
                        {Math.abs(numericAmount).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 font-medium text-[10px] md:text-xs px-2 py-0.5",
                          config.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{config.label}</span>
                      </Badge>
                    </div>
                  </div>
                  {index < visibleTransactions.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              );
            })}

            {visibleCount < filteredTransactions.length && (
              <div className="pt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="gap-2 text-xs md:text-sm w-full md:w-auto"
                  size="sm"
                >
                  <span>
                    Show More ({filteredTransactions.length - visibleCount} left)
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
