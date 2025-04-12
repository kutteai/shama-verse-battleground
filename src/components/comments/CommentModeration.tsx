
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Flag, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  reported: boolean;
  reportReason?: string;
  contentType: "challenge" | "freestyle";
  contentTitle: string;
}

interface CommentModerationProps {
  comments: Comment[];
  reportedComments: Comment[];
}

const CommentModeration = ({ comments, reportedComments }: CommentModerationProps) => {
  const [activeComments, setActiveComments] = useState<Comment[]>(comments);
  const [showReported, setShowReported] = useState<boolean>(false);

  const handleTabChange = (value: string) => {
    if (value === "reported") {
      setActiveComments(reportedComments);
      setShowReported(true);
    } else {
      setActiveComments(comments);
      setShowReported(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Comment Moderation
        </CardTitle>
        <CardDescription>
          Manage and moderate user comments across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Comments</TabsTrigger>
            <TabsTrigger value="reported">
              Reported Comments
              {reportedComments.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {reportedComments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4 space-y-4">
            {activeComments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                showReportReason={false} 
              />
            ))}
          </TabsContent>
          <TabsContent value="reported" className="mt-4 space-y-4">
            {reportedComments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                showReportReason={true} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const CommentItem = ({ 
  comment, 
  showReportReason 
}: { 
  comment: Comment; 
  showReportReason: boolean;
}) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{comment.user.name}</p>
              <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-muted-foreground flex items-center">
                {comment.likes} likes
              </span>
              <span className="text-xs text-muted-foreground flex items-center">
                {comment.replies} replies
              </span>
              <Badge variant="outline" className="text-xs">
                {comment.contentType === "challenge" ? "Challenge" : "Freestyle"}: {comment.contentTitle}
              </Badge>
            </div>
            {showReportReason && comment.reportReason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-xs text-red-600">
                  Reported for: {comment.reportReason}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </Button>
        {showReportReason && (
          <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
            <Flag className="h-3 w-3 mr-1" />
            Mark as Reviewed
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
          <X className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CommentModeration;
