
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge } from "./ChallengeTable";

interface ChallengeStatsProps {
  challenges: Challenge[];
}

const ChallengeStats = ({ challenges }: ChallengeStatsProps) => {
  return (
    <Card className="p-5">
      <CardTitle className="mb-4">Challenge Statistics</CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Total Challenges</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold">{challenges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Active Challenges</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold">
              {challenges.filter(c => c.status === "ongoing").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Total Prize Pool</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold">
              ${challenges.reduce((sum, c) => sum + c.amount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};

export default ChallengeStats;
