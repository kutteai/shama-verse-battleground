import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TopViewedChallenge } from "@/lib/impressionsAdminApi";

interface TopViewedChallengesProps {
  challenges: TopViewedChallenge[];
}

const TopViewedChallenges = ({ challenges }: TopViewedChallengesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-500" />
          Most Viewed Challenges
        </CardTitle>
        <CardDescription>Top performing challenges based on impressions</CardDescription>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground">No challenges yet.</p>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-4 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Swords className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{challenge.title}</p>
                  <p className="text-xs text-muted-foreground">
                    @{challenge.challenger.username} vs @{challenge.challengee.username}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {challenge.views_count.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopViewedChallenges;
