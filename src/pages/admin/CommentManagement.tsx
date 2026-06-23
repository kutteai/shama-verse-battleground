
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CommentModeration from "@/components/comments/CommentModeration";
import CommentAnalytics from "@/components/comments/CommentAnalytics";
import { toast } from "sonner";

import {
  getCommentModerationData,
  deleteComment,
  deleteChallengeComment,
} from "@/lib/commentsAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const CommentManagement = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const moderationQuery = useQuery({
    queryKey: queryKeys.commentModeration(search),
    queryFn: () => getCommentModerationData(search || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, commentType }: { id: string; commentType: "video" | "challenge" }) =>
      commentType === "video" ? deleteComment(id) : deleteChallengeComment(id),
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comments", "moderation"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete comment");
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comment Management</h1>
            <p className="text-muted-foreground">Monitor and moderate user comments across the platform</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search by content or username..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className="grid grid-cols-1 gap-6">
          {moderationQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : moderationQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load comments.</p>
          ) : (
            <CommentModeration
              recent={moderationQuery.data?.recent ?? []}
              reported={moderationQuery.data?.reported ?? []}
              onDelete={(id, commentType) => deleteMutation.mutate({ id, commentType })}
              isDeleting={deleteMutation.isPending}
            />
          )}

          {/* Coming soon: no sentiment/trend analytics backend yet */}
          <CommentAnalytics />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommentManagement;
