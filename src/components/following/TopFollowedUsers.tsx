
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FollowedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  growthRate: number;
  genres: string[];
}

interface TopFollowedUsersProps {
  users: FollowedUser[];
}

const TopFollowedUsers = ({ users }: TopFollowedUsersProps) => {
  // Find the highest follower count to normalize progress bars
  const maxFollowers = Math.max(...users.map(user => user.followers));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-indigo-500" />
          Top Followed Users
        </CardTitle>
        <CardDescription>
          Users with the highest follower counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={user.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-5">
                    {index + 1}.
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium">{user.followers.toLocaleString()} followers</p>
                  <p className={`text-xs ${user.growthRate > 0 ? "text-green-500" : "text-red-500"}`}>
                    {user.growthRate > 0 ? "+" : ""}{user.growthRate}% this week
                  </p>
                </div>
              </div>
              <Progress value={(user.followers / maxFollowers) * 100} className="h-2" />
              <div className="flex gap-1 flex-wrap">
                {user.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs px-2 py-0">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFollowedUsers;
