
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  MoreHorizontal,
  BarChart3,
  Gift,
  PauseCircle,
  Ban,
  Trash2,
  Calendar,
  CalendarDays,
  Tag,
  XCircle,
} from "lucide-react";

// Types
export interface Challenge {
  id: number;
  title: string;
  creator: { username: string; avatar: string | null };
  challenger: { username: string; avatar: string | null };
  type: "paid" | "free";
  amount: number;
  status: "ongoing" | "pending" | "completed" | "flagged";
  votes: { creator: number; challenger: number };
  giftTotal: number;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  views: number;
}

interface ChallengeTableProps {
  challenges: Challenge[];
  onViewDetails: (challenge: Challenge) => void;
  onViewVotingAnalytics: (challenge: Challenge) => void;
  onViewGiftDonations: (challenge: Challenge) => void;
  onPauseChallenge: (challenge: Challenge) => void;
  onBanChallenge: (challenge: Challenge) => void;
  onDeleteChallenge: (challenge: Challenge) => void;
}

const ChallengeTable = ({
  challenges,
  onViewDetails,
  onViewVotingAnalytics,
  onViewGiftDonations,
  onPauseChallenge,
  onBanChallenge,
  onDeleteChallenge
}: ChallengeTableProps) => {
  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "flagged":
        return <Badge className="bg-red-500">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const challengeTypeColors = {
    paid: "text-green-500 bg-green-50",
    free: "text-blue-500 bg-blue-50",
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Challenge Details</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Votes</TableHead>
          <TableHead className="hidden md:table-cell">Timeline</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{challenge.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>By:</span> {challenge.creator.username} <span>vs.</span> {challenge.challenger.username}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye size={12} /> {challenge.views.toLocaleString()}
                    <Gift size={12} className="ml-2" /> {challenge.giftTotal}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${challengeTypeColors[challenge.type]}`}>
                  {challenge.type === "paid" && <span className="mr-1">$</span>}
                  {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                  {challenge.type === "paid" && ` ($${challenge.amount})`}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(challenge.status)}</TableCell>
              <TableCell>
                <div className="space-y-2 w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{challenge.votes.creator}</span>
                    <span>{challenge.votes.challenger}</span>
                  </div>
                  <Progress 
                    value={challenge.votes.creator / (challenge.votes.creator + challenge.votes.challenger) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{challenge.creator.username}</span>
                    <span>{challenge.challenger.username}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <CalendarDays size={14} className="mr-1 text-muted-foreground" /> 
                    <span>Start: {formatDate(challenge.startDate)}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Calendar size={14} className="mr-1 text-muted-foreground" /> 
                    <span>End: {formatDate(challenge.endDate)}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Tag size={14} className="mr-1 text-muted-foreground" /> 
                    <span className="capitalize">{challenge.category}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onViewDetails(challenge)}
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onViewVotingAnalytics(challenge)}
                    >
                      <BarChart3 size={16} />
                      <span>Voting Analytics</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onViewGiftDonations(challenge)}
                    >
                      <Gift size={16} />
                      <span>Gift Donations</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {challenge.status === "ongoing" && (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-yellow-500"
                        onClick={() => onPauseChallenge(challenge)}
                      >
                        <PauseCircle size={16} />
                        <span>Pause Challenge</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer text-red-500"
                      onClick={() => onBanChallenge(challenge)}
                    >
                      <Ban size={16} />
                      <span>Ban Challenge</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer text-red-700"
                      onClick={() => onDeleteChallenge(challenge)}
                    >
                      <Trash2 size={16} />
                      <span>Delete Challenge</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <XCircle size={36} className="mb-2" />
                <p>No challenges found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ChallengeTable;
