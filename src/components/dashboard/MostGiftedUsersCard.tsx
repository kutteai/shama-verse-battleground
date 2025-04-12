
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface GiftedUserProps {
  name: string;
  giftsReceived: number;
  giftValue: string;
}

interface MostGiftedUsersCardProps {
  users: GiftedUserProps[];
}

const MostGiftedUsersCard = ({ users }: MostGiftedUsersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Crown className="h-5 w-5 mr-2 text-purple-500" />
          Most Gifted Users
        </CardTitle>
        <CardDescription>Users receiving most gifts</CardDescription>
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
                <div className="font-medium text-purple-600">{user.giftsReceived} gifts</div>
                <div className="text-muted-foreground">{user.giftValue}</div>
              </div>
            </div>
          ))}
          
          <Button className="w-full mt-2" variant="outline">View Gift Analytics</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MostGiftedUsersCard;
