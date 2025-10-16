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

interface Transaction {
  id?: string | number;
  note: string;
  amount: number;
  status: "successful" | "refunded" | "pending" | "failed";
  created_at?: string;
}

interface TransactionsListProps {
  visibleTrans: Transaction[];
  filteredTrans: Transaction[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  transactionHistory: Transaction[];
  filter: Function;
  openFilter: Function;
  setTrans: Function;
  open: boolean;
  setOpen: Function;
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

export default function TransactionsList({
  visibleTrans,
  filteredTrans,
  visibleCount,
  setVisibleCount,
  transactionHistory,
  filter,

  setTrans,
  open,
  setOpen,
}: TransactionsListProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Recent Activities
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {filteredTrans.length} total transactions
          </CardDescription>
        </div>

        <div className="relative md:w-auto w-full flex justify-end">
          

          <Filters
            handleClick={(e: any) =>
              filter(e, setTrans, transactionHistory, setOpen)
            }
            open={open}
            right="left-0"
          />
        </div>
      </CardHeader>

      <CardContent>
        {visibleTrans.length === 0 ? (
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
            {visibleTrans.map((item, index) => {
              const config = statusConfig[item.status];
              const StatusIcon = config.icon;
              const date = getTime(item);
              const isCredit = item.status === "refunded";
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
                          isCredit ? "bg-green-100" : "bg-red-100"
                        )}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
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
                          isCredit ? "text-green-600" : "text-red-600"
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
                  {index < visibleTrans.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              );
            })}

            {visibleCount < filteredTrans.length && (
              <div className="pt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="gap-2 text-xs md:text-sm w-full md:w-auto"
                  size="sm"
                >
                  <span>
                    Show More ({filteredTrans.length - visibleCount} left)
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
