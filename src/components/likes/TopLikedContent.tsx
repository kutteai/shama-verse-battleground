
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LikedContent {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
  };
  likes: number;
  views: number;
  genre: string;
  duration: string;
}

interface TopLikedContentProps {
  videos: LikedContent[];
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
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center space-x-4 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <Avatar>
                <AvatarImage src={video.creator.avatar} alt={video.creator.name} />
                <AvatarFallback>{video.creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{video.title}</p>
                <p className="text-xs text-muted-foreground">{video.creator.name}</p>
              </div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 flex items-center">
                <Heart className="h-3 w-3 mr-1 fill-red-500 stroke-red-500" />
                {video.likes.toLocaleString()}
              </Badge>
              <div>
                <p className="text-xs text-muted-foreground">Views</p>
                <p className="text-sm font-medium">{video.views.toLocaleString()}</p>
              </div>
              <Badge variant="outline">{video.genre}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopLikedContent;
