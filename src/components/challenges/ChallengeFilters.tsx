
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ChallengeFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (value: boolean) => void;
  resetFilters: () => void;
  onSearch: () => void;
}

const ChallengeFilters = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  isFiltersOpen,
  setIsFiltersOpen,
  resetFilters,
  onSearch,
}: ChallengeFiltersProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filters
        </Button>
      </div>

      {isFiltersOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Challenge Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="1">Free</SelectItem>
                    <SelectItem value="2">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Accepted</SelectItem>
                    <SelectItem value="5">Running</SelectItem>
                    <SelectItem value="6">Completed</SelectItem>
                    <SelectItem value="7">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  Reset
                </Button>
                <Button className="flex-1" onClick={() => { onSearch(); setIsFiltersOpen(false); }}>
                  Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        className="flex mb-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by title or username..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </>
  );
};

export default ChallengeFilters;
