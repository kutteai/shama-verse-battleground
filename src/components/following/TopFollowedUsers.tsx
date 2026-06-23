
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FollowedUser {
  id: number;
  username: string;
  profile_pic: string | null;
  talent: string | null;
  followers_count: number;
}

interface TopFollowedUsersProps {
  users: FollowedUser[];
}

const TopFollowedUsers = ({ users }: TopFollowedUsersProps) => {
  const maxFollowers = Math.max(1, ...users.map((user) => user.followers_count));

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
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={user.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      {index + 1}.
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_pic ?? undefined} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{user.followers_count.toLocaleString()} followers</p>
                </div>
                <Progress value={(user.followers_count / maxFollowers) * 100} className="h-2" />
                {user.talent && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {user.talent}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopFollowedUsers;
