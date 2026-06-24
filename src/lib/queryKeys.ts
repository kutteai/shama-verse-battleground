export const queryKeys = {
  dashboardSummary: ["dashboard", "summary"] as const,
  dashboardTrends: (days: number) => ["dashboard", "trends", days] as const,
  topFollowedUsers: ["following", "top-followed"] as const,
  followTrends: (days: number) => ["following", "trends", days] as const,
  topLikedVideos: ["likes", "top-liked"] as const,
  likesTrend: (days: number) => ["likes", "trend", days] as const,
  freestyles: (search: string, ordering: string, page: number) => ["freestyles", search, ordering, page] as const,
  moderationLogs: (search: string) => ["moderation-logs", search] as const,
  adminProfile: ["admin", "profile"] as const,
  users: (search: string, accountStatus: string, page: number) => ["users", search, accountStatus, page] as const,
  commentModeration: (search: string) => ["comments", "moderation", search] as const,
  userSegments: ["user-behavior", "segments"] as const,
  creatorInsights: (search: string, sortBy: string, page: number) =>
    ["creator-insights", search, sortBy, page] as const,
  reports: (contentType: string, status: string, search: string) =>
    ["reports", contentType, status, search] as const,
  reportModerationLogs: (search: string) => ["reports", "moderation-logs", search] as const,
  challenges: (status: string, challengeType: string, search: string, page: number) =>
    ["challenges", status, challengeType, search, page] as const,
  challengeDetail: (id: string) => ["challenges", "detail", id] as const,
  notificationCampaigns: (page: number) => ["notifications", "campaigns", page] as const,
}
