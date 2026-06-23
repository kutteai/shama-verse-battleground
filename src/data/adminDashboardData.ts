
// Messaging & Communication Data
export const flaggedMessages = [
  {
    id: "msg-001",
    sender: "john_doe",
    recipient: "sarah_smith",
    content: "This message contains inappropriate content that violates our community guidelines.",
    reason: "Inappropriate Content",
    timestamp: "2025-04-12 14:32:21"
  },
  {
    id: "msg-002",
    sender: "alex_beats",
    recipient: "michaelJ",
    content: "Stop messaging me or I will report you to the platform administrators.",
    reason: "Harassment",
    timestamp: "2025-04-12 10:15:43"
  },
  {
    id: "msg-003",
    sender: "rap_master",
    recipient: "beatmaker92",
    content: "Check out this unauthorized link to download music for free without paying.",
    reason: "Spam/Scam",
    timestamp: "2025-04-11 19:21:08"
  }
];

export const messagingAnalyticsData = {
  daily: [
    { name: "12 AM", messages: 145 },
    { name: "3 AM", messages: 56 },
    { name: "6 AM", messages: 124 },
    { name: "9 AM", messages: 478 },
    { name: "12 PM", messages: 856 },
    { name: "3 PM", messages: 1247 },
    { name: "6 PM", messages: 1594 },
    { name: "9 PM", messages: 1076 }
  ],
  weekly: [
    { name: "Mon", messages: 4532 },
    { name: "Tue", messages: 5321 },
    { name: "Wed", messages: 6284 },
    { name: "Thu", messages: 5194 },
    { name: "Fri", messages: 7382 },
    { name: "Sat", messages: 8471 },
    { name: "Sun", messages: 6193 }
  ],
  monthly: [
    { name: "Week 1", messages: 28432 },
    { name: "Week 2", messages: 31943 },
    { name: "Week 3", messages: 34853 },
    { name: "Week 4", messages: 37294 }
  ]
};

// Likes Management Data
// Likes Management and Following System now use real data — see
// src/lib/likesAdminApi.ts and src/lib/followingAdminApi.ts.

// Creator Insights Data
export const creatorPerformanceData = {
  id: "creator-001",
  name: "Lyrical Genius",
  username: "lyrical_genius",
  avatar: "https://i.pravatar.cc/150?img=5",
  verified: true,
  earningsData: [
    { name: "Jan", amount: 1245 },
    { name: "Feb", amount: 1587 },
    { name: "Mar", amount: 1823 },
    { name: "Apr", amount: 2354 },
    { name: "May", amount: 3241 },
    { name: "Jun", amount: 2875 },
  ],
  engagementData: [
    { name: "Jan", value: 58 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 72 },
    { name: "Apr", value: 78 },
    { name: "May", value: 85 },
    { name: "Jun", value: 82 },
  ],
  stats: {
    earnings: 12345,
    uploadFrequency: "3.2/week",
    winRate: "68%",
    fanEngagement: "High"
  }
};

// User Behavior Analytics Data
export const userJourneyHeatmapData = [
  {
    name: "New Users",
    cells: [
      { stage: "Signup", value: 100, color: "#22c55e" },
      { stage: "View", value: 78, color: "#22c55e" },
      { stage: "Like", value: 45, color: "#fbbf24" },
      { stage: "Follow", value: 32, color: "#f97316" },
      { stage: "Message", value: 12, color: "#ef4444" },
      { stage: "Gift", value: 5, color: "#ef4444" }
    ]
  },
  {
    name: "Casual Users",
    cells: [
      { stage: "Signup", value: 100, color: "#22c55e" },
      { stage: "View", value: 92, color: "#22c55e" },
      { stage: "Like", value: 68, color: "#22c55e" },
      { stage: "Follow", value: 45, color: "#fbbf24" },
      { stage: "Message", value: 18, color: "#f97316" },
      { stage: "Gift", value: 8, color: "#ef4444" }
    ]
  },
  {
    name: "Active Users",
    cells: [
      { stage: "Signup", value: 100, color: "#22c55e" },
      { stage: "View", value: 98, color: "#22c55e" },
      { stage: "Like", value: 85, color: "#22c55e" },
      { stage: "Follow", value: 72, color: "#22c55e" },
      { stage: "Message", value: 58, color: "#fbbf24" },
      { stage: "Gift", value: 32, color: "#f97316" }
    ]
  },
  {
    name: "Power Users",
    cells: [
      { stage: "Signup", value: 100, color: "#22c55e" },
      { stage: "View", value: 100, color: "#22c55e" },
      { stage: "Like", value: 95, color: "#22c55e" },
      { stage: "Follow", value: 88, color: "#22c55e" },
      { stage: "Message", value: 75, color: "#22c55e" },
      { stage: "Gift", value: 58, color: "#fbbf24" }
    ]
  }
];

export const userBehaviorSegmentsData = [
  {
    name: "Lurkers",
    value: 12584,
    color: "#94a3b8",
    description: "Users who only watch content but rarely engage"
  },
  {
    name: "Casual Engagers",
    value: 8752,
    color: "#60a5fa",
    description: "Users who occasionally like and follow"
  },
  {
    name: "Active Participants",
    value: 5341,
    color: "#818cf8",
    description: "Users who regularly engage with content and message others"
  },
  {
    name: "Superfans",
    value: 2189,
    color: "#8b5cf6",
    description: "Users who actively gift and support creators financially"
  },
  {
    name: "Creators",
    value: 1587,
    color: "#6366f1",
    description: "Users who regularly upload content and participate in challenges"
  }
];

// Comment Management Data
export const commentData = [
  {
    id: "comment-001",
    user: {
      name: "John Smith",
      username: "john_smith",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    content: "This freestyle was amazing! Definitely one of the best performances I've seen this month.",
    timestamp: "2 hours ago",
    likes: 45,
    replies: 3,
    reported: false,
    contentType: "freestyle",
    contentTitle: "NYC Underground Freestyle Battle"
  },
  {
    id: "comment-002",
    user: {
      name: "Sarah Williams",
      username: "sarah_williams",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    content: "The beat selection was fire but the lyrics could have been better.",
    timestamp: "5 hours ago",
    likes: 23,
    replies: 7,
    reported: false,
    contentType: "challenge",
    contentTitle: "Weekly Rap Challenge: Summer Vibes"
  },
  {
    id: "comment-003",
    user: {
      name: "Mike Johnson",
      username: "mike_johnson",
      avatar: "https://i.pravatar.cc/150?img=13"
    },
    content: "This challenge was rigged! No way that performance deserved to win!",
    timestamp: "1 day ago",
    likes: 12,
    replies: 15,
    reported: true,
    reportReason: "Harassment",
    contentType: "challenge",
    contentTitle: "R&B Soul Challenge Finals"
  },
  {
    id: "comment-004",
    user: {
      name: "Anna Davis",
      username: "anna_davis",
      avatar: "https://i.pravatar.cc/150?img=14"
    },
    content: "Check out my profile for better freestyles and don't forget to follow me!",
    timestamp: "2 days ago",
    likes: 3,
    replies: 0,
    reported: true,
    reportReason: "Spam",
    contentType: "freestyle",
    contentTitle: "Afrobeat Dance Competition"
  }
];

export const reportedCommentsData = [
  {
    id: "comment-003",
    user: {
      name: "Mike Johnson",
      username: "mike_johnson",
      avatar: "https://i.pravatar.cc/150?img=13"
    },
    content: "This challenge was rigged! No way that performance deserved to win!",
    timestamp: "1 day ago",
    likes: 12,
    replies: 15,
    reported: true,
    reportReason: "Harassment",
    contentType: "challenge",
    contentTitle: "R&B Soul Challenge Finals"
  },
  {
    id: "comment-004",
    user: {
      name: "Anna Davis",
      username: "anna_davis",
      avatar: "https://i.pravatar.cc/150?img=14"
    },
    content: "Check out my profile for better freestyles and don't forget to follow me!",
    timestamp: "2 days ago",
    likes: 3,
    replies: 0,
    reported: true,
    reportReason: "Spam",
    contentType: "freestyle",
    contentTitle: "Afrobeat Dance Competition"
  },
  {
    id: "comment-005",
    user: {
      name: "Robert Taylor",
      username: "rob_taylor",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    content: "This content contains inappropriate language and violates community guidelines.",
    timestamp: "3 days ago",
    likes: 1,
    replies: 2,
    reported: true,
    reportReason: "Inappropriate Content",
    contentType: "freestyle",
    contentTitle: "West Coast Rap Showdown"
  }
];

export const commentAnalyticsData = {
  data: [
    { name: "Mon", total: 523, positive: 312, neutral: 156, negative: 55 },
    { name: "Tue", total: 645, positive: 389, neutral: 187, negative: 69 },
    { name: "Wed", total: 587, positive: 342, neutral: 198, negative: 47 },
    { name: "Thu", total: 689, positive: 401, neutral: 213, negative: 75 },
    { name: "Fri", total: 842, positive: 512, neutral: 245, negative: 85 },
    { name: "Sat", total: 967, positive: 602, neutral: 276, negative: 89 },
    { name: "Sun", total: 752, positive: 458, neutral: 224, negative: 70 }
  ],
  totalComments: 5006,
  avgCommentsPerContent: 24.5,
  commentEngagementRate: "18.3%"
};

// System and Technical Data
export const errorLogData = [
  {
    id: "err-001",
    timestamp: "2025-04-12 14:35:22",
    errorCode: "AUTH_ERROR_401",
    message: "User authentication failed: Invalid token provided",
    source: "Authentication Service",
    deviceInfo: {
      os: "iOS 17.4",
      browser: "Safari",
      appVersion: "2.3.1"
    },
    severity: "medium"
  },
  {
    id: "err-002",
    timestamp: "2025-04-12 12:12:56",
    errorCode: "API_ERROR_503",
    message: "Service unavailable: Database connection timeout",
    source: "API Gateway",
    deviceInfo: {
      os: "Android 14",
      browser: "Chrome",
      appVersion: "2.3.1"
    },
    severity: "high"
  },
  {
    id: "err-003",
    timestamp: "2025-04-12 08:45:11",
    errorCode: "MEDIA_ERROR_404",
    message: "Media file not found: Referenced asset could not be located",
    source: "Media Service",
    deviceInfo: {
      os: "Windows 11",
      browser: "Edge",
      appVersion: "2.3.0"
    },
    severity: "low"
  },
  {
    id: "err-004",
    timestamp: "2025-04-11 23:17:43",
    errorCode: "PAYMENT_ERROR_422",
    message: "Payment processing failed: Invalid payment method details",
    source: "Payment Gateway",
    deviceInfo: {
      os: "macOS 15.1",
      browser: "Firefox",
      appVersion: "2.3.1"
    },
    severity: "critical"
  }
];

export const apiStatusData = {
  endpoints: [
    {
      id: "api-001",
      name: "Authentication API",
      status: "operational",
      responseTime: 85,
      uptime: "99.99%"
    },
    {
      id: "api-002",
      name: "Media Processing Service",
      status: "operational",
      responseTime: 210,
      uptime: "99.95%"
    },
    {
      id: "api-003",
      name: "Payment Gateway",
      status: "degraded",
      responseTime: 450,
      uptime: "99.87%",
      lastIncident: "2025-04-11 23:17:43"
    },
    {
      id: "api-004",
      name: "User Profile Service",
      status: "operational",
      responseTime: 125,
      uptime: "99.98%"
    },
    {
      id: "api-005",
      name: "Notification Service",
      status: "maintenance",
      responseTime: 180,
      uptime: "99.75%",
      lastIncident: "Scheduled maintenance"
    }
  ],
  lastUpdated: "2025-04-12 15:30:45"
};
