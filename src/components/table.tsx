import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface TableProps {
  tableValue?: any[];
  theme?: boolean;
  action?: string;
}

const DataTable: React.FC<TableProps> = ({ tableValue, action }) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusLower = status?.toLowerCase();
    if (statusLower?.includes("success") || statusLower?.includes("completed")) return "default";
    if (statusLower?.includes("pending") || statusLower?.includes("waiting")) return "secondary";
    if (statusLower?.includes("failed") || statusLower?.includes("error")) return "destructive";
    return "outline";
  };

  if (!tableValue || tableValue.length === 0) {
    return (
      <div className="rounded-lg  border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              {action && <TableHead>{action}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={action ? 9 : 8} className="text-center h-32 text-muted-foreground">
                No results found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <ScrollArea className="h-[400px] w-full">
        <Table className="rounded-xl">
          <TableHeader className=" bg-background rounded-xl">
            <TableRow className="rounded-xl">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Number</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="font-semibold">Provider</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              {action && <TableHead className="font-semibold">{action}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableValue.map((item: any, index: number) => (
              <TableRow key={item.reference_code || index} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[100px]" title={item.reference_code}>
                      {item.reference_code}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(item.reference_code, "Order ID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span>{item.purchased_number}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(item.purchased_number, "Number")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.sms ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">{item.sms}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(item.sms, "Code")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Waiting...</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.country}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{item.service}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.provider}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-sm">₦{item.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)} className="text-xs">
                    {item.status}
                  </Badge>
                </TableCell>
                {action && (
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {action}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default DataTable;