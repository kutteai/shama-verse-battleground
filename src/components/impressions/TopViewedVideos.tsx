import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TopLikedVideo } from "@/lib/likesAdminApi";

interface TopViewedVideosProps {
  videos: TopLikedVideo[];
}

const TopViewedVideos = ({ videos }: TopViewedVideosProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-500" />
          Most Viewed Videos
        </CardTitle>
        <CardDescription>Top performing videos based on impressions</CardDescription>
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
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {video.views_count.toLocaleString()}
                </Badge>
                {video.user.talent && <Badge variant="outline">{video.user.talent}</Badge>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopViewedVideos;
