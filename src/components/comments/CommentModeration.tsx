
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, AlertTriangle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminComment, AdminReportedComment } from "@/lib/commentsAdminApi";

interface CommentModerationProps {
  recent: AdminComment[];
  reported: AdminReportedComment[];
  onDelete: (id: string, commentType: "video" | "challenge") => void;
  isDeleting: boolean;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso)
  );

const CommentItem = ({
  comment,
  showReportReason,
  onDelete,
  isDeleting,
}: {
  comment: AdminComment | AdminReportedComment;
  showReportReason: boolean;
  onDelete: (id: string, commentType: "video" | "challenge") => void;
  isDeleting: boolean;
}) => {
  const reported = comment as AdminReportedComment;
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={comment.user.profile_pic ?? undefined} alt={comment.user.username} />
            <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">@{comment.user.username}</span>
              <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">{comment.replies_count} replies</span>
              <Badge variant="outline" className="text-xs capitalize">
                {comment.comment_type}: {comment.content_title}
              </Badge>
            </div>
            {showReportReason && reported.report_reason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-xs text-red-600">Reported for: {reported.report_reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs flex items-center text-red-500 hover:text-red-700"
          disabled={isDeleting}
          onClick={() => onDelete(comment.id, comment.comment_type)}
        >
          <X className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

const CommentModeration = ({ recent, reported, onDelete, isDeleting }: CommentModerationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Comment Moderation
        </CardTitle>
        <CardDescription>Manage and moderate user comments across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Comments ({recent.length})</TabsTrigger>
            <TabsTrigger value="reported">
              Reported
              {reported.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {reported.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4 space-y-4">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No comments yet.</p>
            ) : (
              recent.map((c) => (
                <CommentItem key={c.id} comment={c} showReportReason={false} onDelete={onDelete} isDeleting={isDeleting} />
              ))
            )}
          </TabsContent>
          <TabsContent value="reported" className="mt-4 space-y-4">
            {reported.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No reported comments.</p>
            ) : (
              reported.map((c) => (
                <CommentItem key={c.id} comment={c} showReportReason={true} onDelete={onDelete} isDeleting={isDeleting} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommentModeration;
