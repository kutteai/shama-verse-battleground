
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminChallenge } from "@/lib/challengesAdminApi";

interface ChallengeStatsProps {
  challenges: AdminChallenge[];
  totalCount?: number;
}

const ChallengeStats = ({ challenges, totalCount }: ChallengeStatsProps) => {
  const paused = challenges.filter((c) => c.is_paused_by_admin).length;
  const banned = challenges.filter((c) => c.is_banned_by_admin).length;
  const running = challenges.filter((c) => c.status === 5).length;

  return (
    <Card className="p-5">
      <CardTitle className="mb-4">Challenge Statistics</CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Total Challenges</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold">{totalCount ?? challenges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Running</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold">{running}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Paused by Admin</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold text-yellow-600">{paused}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Banned by Admin</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold text-destructive">{banned}</div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};

export default ChallengeStats;
