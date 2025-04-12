
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface TransactionFiltersProps {
  selectedStatus: string;
  selectedType: string;
  selectedDateRange: DateRange | undefined;
  selectedSort: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const TransactionFilters = ({
  selectedStatus,
  selectedType,
  selectedDateRange,
  selectedSort,
  onStatusChange,
  onTypeChange,
  onDateRangeChange,
  onSortChange,
  onReset
}: TransactionFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Filter size={16} />
        Filters
      </Button>

      {isFiltersOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Transaction Status</label>
                <Select value={selectedStatus} onValueChange={onStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Transaction Type</label>
                <Select value={selectedType} onValueChange={onTypeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gift_purchase">Gift Purchase</SelectItem>
                    <SelectItem value="challenge_entry">Challenge Entry</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="challenge_earnings">Challenge Earnings</SelectItem>
                    <SelectItem value="gift_received">Gift Received</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker 
                  className="mt-1"
                  value={selectedDateRange}
                  onValueChange={onDateRangeChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Sort By</label>
                <Select value={selectedSort} onValueChange={onSortChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="amount_high">Amount (High to Low)</SelectItem>
                    <SelectItem value="amount_low">Amount (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={onReset}
              >
                Reset Filters
              </Button>
              <Button onClick={() => setIsFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
