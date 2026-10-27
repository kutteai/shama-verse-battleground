import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import {
  getUserLeaderboard,
  getChallengeWinsLeaderboard,
  type LeaderboardMetric,
} from "@/lib/leaderboardAdminApi";
import { getEvents, getEventDetail } from "@/lib/locationChallengesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const GLOBAL_METRICS: { value: LeaderboardMetric; label: string }[] = [
  { value: "wins", label: "Challenges Won" },
  { value: "challenges", label: "Challenges Played" },
  { value: "followers", label: "Followers" },
  { value: "votes", label: "Votes" },
  { value: "likes", label: "Likes" },
];

function rankBadgeColor(rank: number) {
  if (rank === 1) return "bg-yellow-500 text-white";
  if (rank === 2) return "bg-gray-400 text-white";
  if (rank === 3) return "bg-amber-700 text-white";
  return "bg-muted text-muted-foreground";
}

function GlobalLeaderboard() {
  const [metric, setMetric] = useState<LeaderboardMetric>("wins");

  const query = useQuery({
    queryKey: queryKeys.leaderboard(metric, 20),
    queryFn: () => (metric === "wins" ? getChallengeWinsLeaderboard(20) : getUserLeaderboard(metric, 20)),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Global Leaderboard</CardTitle>
        <Select value={metric} onValueChange={(v) => setMetric(v as LeaderboardMetric)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GLOBAL_METRICS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : query.isError ? (
          <p className="text-sm text-destructive">Failed to load leaderboard.</p>
        ) : query.data && query.data.results.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">
                  {GLOBAL_METRICS.find((m) => m.value === metric)?.label}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.results.map((entry) => (
                <TableRow key={entry.user.id}>
                  <TableCell>
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankBadgeColor(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/users/${entry.user.id}`} className="flex items-center gap-2 hover:underline">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={entry.user.profile_pic ?? undefined} alt={entry.user.username} />
                        <AvatarFallback>{entry.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user.username}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{entry.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">No data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function LocationChallengeLeaderboard() {
  const [eventId, setEventId] = useState<string>("");

  const eventsQuery = useQuery({
    queryKey: queryKeys.locationChallengeEvents("", "", "", 1),
    queryFn: () => getEvents({}),
  });

  const detailQuery = useQuery({
    queryKey: queryKeys.locationChallengeEventDetail(eventId),
    queryFn: () => getEventDetail(eventId),
    enabled: !!eventId,
  });

  const events = eventsQuery.data?.results ?? [];
  const sortedLedger = [...(detailQuery.data?.ledger_entries ?? [])].sort((a, b) => b.points - a.points);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Location Challenge Leaderboard</CardTitle>
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.title} ({ev.tag || ev.location})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {!eventId ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Pick a location challenge event above to see its leaderboard.
          </p>
        ) : detailQuery.isLoading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : detailQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load this event's leaderboard.</p>
        ) : sortedLedger.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Ties</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLedger.map((entry, i) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankBadgeColor(
                        i + 1
                      )}`}
                    >
                      {i + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/users/${entry.user.id}`} className="flex items-center gap-2 hover:underline">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={entry.user.profile_pic ?? undefined} alt={entry.user.username} />
                        <AvatarFallback>{entry.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user.username}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{entry.wins}</TableCell>
                  <TableCell className="text-right">{entry.losses}</TableCell>
                  <TableCell className="text-right">{entry.ties}</TableCell>
                  <TableCell className="text-right font-semibold">{entry.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">No participants yet for this event.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Leaderboards() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
            <p className="text-muted-foreground">Platform-wide rankings and location challenge standings.</p>
          </div>
        </div>

        <Tabs defaultValue="global">
          <TabsList>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="location">Location Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="global" className="mt-4">
            <GlobalLeaderboard />
          </TabsContent>
          <TabsContent value="location" className="mt-4">
            <LocationChallengeLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
