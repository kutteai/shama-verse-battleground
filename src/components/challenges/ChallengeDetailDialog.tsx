
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Share2, Bookmark, MessageSquare, Trophy, Play, Music } from "lucide-react";
import { getChallengeDetail, type AdminChallengeVideo, type AdminChallengeUser } from "@/lib/challengesAdminApi";
import { queryKeys } from "@/lib/queryKeys";
import { CHALLENGE_STATUS } from "@/lib/challengesAdminApi";

interface ChallengeDetailDialogProps {
  challengeId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StatCell = ({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) => (
  <div className="flex flex-col items-center gap-0.5 p-2 rounded-md bg-muted/50">
    <span className="text-muted-foreground">{icon}</span>
    <span className="font-semibold text-sm">{value.toLocaleString()}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
)

const VideoPlayer = ({ video, player }: { video: AdminChallengeVideo | null; player: AdminChallengeUser }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={player.profile_pic ?? undefined} />
          <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">@{player.username}</span>
      </div>

      <div className="relative aspect-video rounded-md overflow-hidden bg-black">
        {video?.video_url ? (
          playing ? (
            <video
              src={video.video_url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <>
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Music className="text-muted-foreground" size={28} />
                </div>
              )}
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label="Play"
              >
                <span className="bg-black/50 group-hover:bg-black/70 transition-colors rounded-full p-3">
                  <Play className="h-6 w-6 text-white fill-white" />
                </span>
              </button>
            </>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Music size={28} />
            <span className="text-xs">No video uploaded yet</span>
          </div>
        )}
      </div>

      {video ? (
        <div className="grid grid-cols-3 gap-2">
          <StatCell icon={<Eye size={14} />} value={video.views_count} label="Views" />
          <StatCell icon={<Heart size={14} />} value={video.likes_count} label="Likes" />
          <StatCell icon={<Trophy size={14} />} value={video.vote_count} label="Votes" />
          <StatCell icon={<MessageSquare size={14} />} value={video.comments_count} label="Comments" />
          <StatCell icon={<Share2 size={14} />} value={video.share_count} label="Shares" />
          <StatCell icon={<Bookmark size={14} />} value={video.favorite_count} label="Saves" />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">No video stats yet</p>
      )}
    </div>
  )
}

const ChallengeDetailDialog = ({ challengeId, open, onOpenChange }: ChallengeDetailDialogProps) => {
  const detailQuery = useQuery({
    queryKey: queryKeys.challengeDetail(challengeId ?? ""),
    queryFn: () => getChallengeDetail(challengeId!),
    enabled: open && !!challengeId,
    staleTime: 30_000,
    retry: 1,
  })

  const d = detailQuery.data

  const challengerVotes = d?.challenger_video?.vote_count ?? 0
  const challengeeVotes = d?.challengee_video?.vote_count ?? 0
  const totalVotes = challengerVotes + challengeeVotes
  const challengerPct = totalVotes > 0 ? Math.round((challengerVotes / totalVotes) * 100) : 50
  const challengeePct = 100 - challengerPct

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {d?.title ?? "Challenge Detail"}
            {d && (
              <Badge variant="outline" className="text-xs font-normal">
                {d.status_display}
              </Badge>
            )}
          </DialogTitle>
          {d?.description && (
            <DialogDescription>{d.description}</DialogDescription>
          )}
        </DialogHeader>

        {detailQuery.isLoading && (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
        )}
        {detailQuery.isError && (
          <p className="text-sm text-destructive py-4">Failed to load challenge details.</p>
        )}

        {d && (
          <div className="space-y-6">
            {/* Meta row */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Type: <strong className="text-foreground">{d.challenge_type_display}</strong></span>
              <span>·</span>
              <span>Status: <strong className="text-foreground">{d.status_display}</strong></span>
              {d.is_paused_by_admin && <Badge variant="outline" className="text-orange-500 border-orange-400">Paused</Badge>}
              {d.is_banned_by_admin && <Badge variant="destructive">Banned</Badge>}
              {d.started_at && (
                <>
                  <span>·</span>
                  <span>Started: <strong className="text-foreground">{new Date(d.started_at).toLocaleDateString()}</strong></span>
                </>
              )}
            </div>

            {/* Vote bar */}
            {totalVotes > 0 && (
              <Card>
                <CardHeader className="py-3 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy size={14} /> Vote Breakdown ({totalVotes} total votes)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-medium w-24 truncate">@{d.challenger.username}</span>
                    <span className="text-muted-foreground ml-auto">{challengerPct}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-muted flex">
                    <div
                      className="bg-primary transition-all"
                      style={{ width: `${challengerPct}%` }}
                    />
                    <div className="flex-1 bg-orange-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-muted-foreground">{challengeePct}%</span>
                    <span className="font-medium ml-auto w-24 truncate text-right">@{d.challengee.username}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Side-by-side videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Challenger</p>
                <VideoPlayer video={d.challenger_video} player={d.challenger} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Challengee</p>
                <VideoPlayer video={d.challengee_video} player={d.challengee} />
              </div>
            </div>

            {/* Head-to-head totals */}
            {(d.challenger_video || d.challengee_video) && (
              <Card>
                <CardHeader className="py-3 pb-1">
                  <CardTitle className="text-sm">Head-to-Head Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-4 gap-0 text-xs">
                    <div className="col-span-4 grid grid-cols-[1fr_auto_auto_1fr] font-medium border-b pb-1 mb-2">
                      <span>@{d.challenger.username}</span>
                      <span className="text-center px-2 text-muted-foreground">Stat</span>
                      <span></span>
                      <span className="text-right">@{d.challengee.username}</span>
                    </div>
                    {[
                      { label: "Votes", c: d.challenger_video?.vote_count ?? 0, e: d.challengee_video?.vote_count ?? 0 },
                      { label: "Likes", c: d.challenger_video?.likes_count ?? 0, e: d.challengee_video?.likes_count ?? 0 },
                      { label: "Views", c: d.challenger_video?.views_count ?? 0, e: d.challengee_video?.views_count ?? 0 },
                      { label: "Comments", c: d.challenger_video?.comments_count ?? 0, e: d.challengee_video?.comments_count ?? 0 },
                      { label: "Shares", c: d.challenger_video?.share_count ?? 0, e: d.challengee_video?.share_count ?? 0 },
                      { label: "Saves", c: d.challenger_video?.favorite_count ?? 0, e: d.challengee_video?.favorite_count ?? 0 },
                    ].map(({ label, c, e }) => (
                      <div key={label} className="col-span-4 grid grid-cols-[1fr_auto_auto_1fr] py-1 border-b last:border-0">
                        <span className={c > e ? "font-semibold text-primary" : ""}>{c.toLocaleString()}</span>
                        <span className="text-center px-2 text-muted-foreground">{label}</span>
                        <span></span>
                        <span className={`text-right ${e > c ? "font-semibold text-primary" : ""}`}>{e.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChallengeDetailDialog
