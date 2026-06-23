
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TopLikedVideo } from "@/lib/likesAdminApi";

interface TopLikedContentProps {
  videos: TopLikedVideo[];
}

const TopLikedContent = ({ videos }: TopLikedContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Most Liked Videos
        </CardTitle>
        <CardDescription>
          Top performing videos based on likes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No videos yet.</p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center space-x-4 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <Avatar>
                  <AvatarImage src={video.user.profile_pic ?? undefined} alt={video.user.username} />
                  <AvatarFallback>{video.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <p className="text-xs text-muted-foreground">@{video.user.username}</p>
                </div>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 flex items-center">
                  <Heart className="h-3 w-3 mr-1 fill-red-500 stroke-red-500" />
                  {video.likes_count.toLocaleString()}
                </Badge>
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-medium">{video.views_count.toLocaleString()}</p>
                </div>
                {video.user.talent && <Badge variant="outline">{video.user.talent}</Badge>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopLikedContent;
