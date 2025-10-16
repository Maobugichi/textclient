import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterProps {
  handleClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  open: boolean;
  right?: string;
}

const Filters: React.FC<FilterProps> = ({ handleClick, open, right }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-400 text-sm"
        >
          <Filter size={16} />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={right ? "end" : "start"}
        className="w-40 rounded-xl border border-gray-300 shadow-md"
      >
        {["successful", "refunded", "pending", "clear"].map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={(e:any) => handleClick(e as any)}
            className="capitalize cursor-pointer hover:bg-gray-100 text-center py-1"
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filters;
