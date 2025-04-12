
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

interface UserProps {
  name: string;
  followers: number;
  earnings: string;
}

interface TopEarningUsersCardProps {
  users: UserProps[];
}

const TopEarningUsersCard = ({ users }: TopEarningUsersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Top Earning Users
        </CardTitle>
        <CardDescription>Users with highest earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                  {index + 1}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="text-sm text-right">
                <div className="font-medium text-green-600">{user.earnings}</div>
                <div className="text-muted-foreground">{user.followers.toLocaleString()} followers</div>
              </div>
            </div>
          ))}
          
          <Button className="w-full mt-2" variant="outline">View All Users</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopEarningUsersCard;
