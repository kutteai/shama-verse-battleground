
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
import {
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Ban,
  Trash2,
} from "lucide-react";
import type { AdminChallenge } from "@/lib/challengesAdminApi";

// Re-export for backward compat with ChallengeDialogs
export type { AdminChallenge as Challenge };

interface ChallengeTableProps {
  challenges: AdminChallenge[];
  onPauseChallenge: (challenge: AdminChallenge) => void;
  onResumeChallenge: (challenge: AdminChallenge) => void;
  onBanChallenge: (challenge: AdminChallenge) => void;
  onDeleteChallenge: (challenge: AdminChallenge) => void;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

const ChallengeTable = ({
  challenges,
  onPauseChallenge,
  onResumeChallenge,
  onBanChallenge,
  onDeleteChallenge,
}: ChallengeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Challenger</TableHead>
          <TableHead>Challengee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Flags</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
              No challenges found.
            </TableCell>
          </TableRow>
        ) : (
          challenges.map((ch) => (
            <TableRow key={ch.id}>
              <TableCell className="font-medium max-w-[180px] truncate">{ch.title}</TableCell>
              <TableCell className="text-sm">@{ch.challenger.username}</TableCell>
              <TableCell className="text-sm">@{ch.challengee.username}</TableCell>
              <TableCell>
                <Badge variant={ch.challenge_type === 2 ? "default" : "outline"} className="text-xs">
                  {ch.challenge_type_display}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{ch.status_display}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {ch.is_paused_by_admin && (
                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500">Paused</Badge>
                  )}
                  {ch.is_banned_by_admin && (
                    <Badge variant="destructive" className="text-xs">Banned</Badge>
                  )}
                  {!ch.is_paused_by_admin && !ch.is_banned_by_admin && (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDate(ch.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ch.is_paused_by_admin ? (
                      <DropdownMenuItem onClick={() => onResumeChallenge(ch)}>
                        <PlayCircle className="mr-2 h-4 w-4 text-green-500" />
                        Resume
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onPauseChallenge(ch)}>
                        <PauseCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        Pause
                      </DropdownMenuItem>
                    )}
                    {!ch.is_banned_by_admin && (
                      <DropdownMenuItem onClick={() => onBanChallenge(ch)}>
                        <Ban className="mr-2 h-4 w-4 text-orange-500" />
                        Ban
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDeleteChallenge(ch)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ChallengeTable;
