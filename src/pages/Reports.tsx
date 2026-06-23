
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import { Search, Flag, AlertOctagon, FileWarning, User, MessageSquare, Music } from "lucide-react";
import { toast } from "sonner";

import {
  getReports,
  getModerationLogs,
  updateReportStatus,
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  type AdminReport,
  type ReportType,
  type ReportStatusValue,
} from "@/lib/reportsAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const TYPE_ICONS: Record<ReportType, React.ReactNode> = {
  challenge: <Flag className="h-4 w-4 text-orange-500" />,
  video: <Music className="h-4 w-4 text-purple-500" />,
  user: <User className="h-4 w-4 text-blue-500" />,
  comment: <MessageSquare className="h-4 w-4 text-green-500" />,
};

const STATUS_BADGE: Record<ReportStatusValue, React.ReactNode> = {
  1: <Badge variant="outline" className="text-yellow-600 border-yellow-500">Pending</Badge>,
  2: <Badge className="bg-blue-500">In Progress</Badge>,
  3: <Badge className="bg-green-500">Resolved</Badge>,
  4: <Badge variant="outline" className="text-muted-foreground">Rejected</Badge>,
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso)
  );

const Reports = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [logSearch, setLogSearch] = useState("");
  const [logSearchInput, setLogSearchInput] = useState("");

  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");

  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: queryKeys.reports(contentTypeFilter, statusFilter, search),
    queryFn: () =>
      getReports({
        content_type: contentTypeFilter as ReportType || undefined,
        status: statusFilter ? (Number(statusFilter) as ReportStatusValue) : undefined,
        search: search || undefined,
      }),
  });

  const logsQuery = useQuery({
    queryKey: queryKeys.reportModerationLogs(logSearch),
    queryFn: () => getModerationLogs(logSearch || undefined),
    enabled: activeTab === "logs",
  });

  const actionMutation = useMutation({
    mutationFn: () =>
      updateReportStatus(
        selectedReport!.report_type,
        selectedReport!.id,
        Number(actionStatus) as ReportStatusValue,
        adminNotes
      ),
    onSuccess: () => {
      toast.success("Report updated");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setReportDetailsOpen(false);
      setActionStatus("");
      setAdminNotes("");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update report"),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleLogSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogSearch(logSearchInput);
  };

  const reports = reportsQuery.data ?? [];
  const pendingCount = reports.filter((r) => r.status === REPORT_STATUS.PENDING).length;

  const exportLogsAsJSON = () => {
    const logs = logsQuery.data?.results ?? [];
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moderation_logs.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports &amp; Moderation</h1>
          <p className="text-muted-foreground">Review and handle user reports and moderation history.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <Flag size={15} />
              User Reports
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="flagged" className="flex items-center gap-1">
              <AlertOctagon size={15} />
              Auto-Flagged
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1">
              <FileWarning size={15} />
              Moderation Logs
            </TabsTrigger>
          </TabsList>

          {/* User Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search by username or reason..."
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="challenge">Challenge</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">In Progress</SelectItem>
                  <SelectItem value="3">Resolved</SelectItem>
                  <SelectItem value="4">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="py-4">
                <CardTitle>User-Submitted Reports</CardTitle>
                <CardDescription>Review and take action on content reported by users</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {reportsQuery.isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : reportsQuery.isError ? (
                  <p className="text-sm text-destructive p-4">Failed to load reports.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            <Flag className="mx-auto mb-2" size={32} />
                            No reports found
                          </TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="flex items-center gap-1.5 capitalize">
                                {TYPE_ICONS[report.report_type]}
                                {report.report_type}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={report.reporter.profile_pic ?? undefined} />
                                  <AvatarFallback>{report.reporter.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">@{report.reporter.username}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[160px]">
                              <span className="text-sm truncate block">{report.target_label}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {report.reason.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{STATUS_BADGE[report.status]}</TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(report.created_at)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setActionStatus(String(report.status));
                                  setAdminNotes(report.admin_notes);
                                  setReportDetailsOpen(true);
                                }}
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto-Flagged Tab — no ML pipeline */}
          <TabsContent value="flagged" className="space-y-4">
            {/* Coming soon: no ML/NSFW auto-detection pipeline exists in the backend. */}
            <NotAvailablePanel
              feature="Auto-Flagged Content"
              reason="Automated content moderation (NSFW detection, profanity filtering) requires an ML pipeline that does not exist in the backend yet."
            />
          </TabsContent>

          {/* Moderation Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <div className="flex gap-3">
              <form onSubmit={handleLogSearchSubmit} className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search logs..."
                  className="pl-9"
                  value={logSearchInput}
                  onChange={(e) => setLogSearchInput(e.target.value)}
                />
              </form>
              <Button variant="outline" size="sm" onClick={exportLogsAsJSON} disabled={!logsQuery.data?.results?.length}>
                Export JSON
              </Button>
            </div>

            <Card>
              <CardHeader className="py-4">
                <CardTitle>Moderation Activity Log</CardTitle>
                <CardDescription>Append-only history of admin moderation actions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {logsQuery.isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : logsQuery.isError ? (
                  <p className="text-sm text-destructive p-4">Failed to load logs.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(logsQuery.data?.results ?? []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            No moderation actions logged yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (logsQuery.data?.results ?? []).map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <span className="text-sm font-medium">
                                @{log.admin_user?.username ?? "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {log.action.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                <span className="text-muted-foreground capitalize">{log.target_type}:</span>{" "}
                                {log.target_id.slice(0, 8)}…
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                              {log.reason || "—"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(log.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Review Dialog */}
      {selectedReport && (
        <Dialog open={reportDetailsOpen} onOpenChange={setReportDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Report</DialogTitle>
              <DialogDescription>
                {selectedReport.report_type} reported by @{selectedReport.reporter.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 capitalize">{selectedReport.report_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="ml-2 capitalize">{selectedReport.reason.replace(/_/g, " ")}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="ml-2">{selectedReport.target_label}</span>
                </div>
              </div>
              {selectedReport.description && (
                <div className="p-3 bg-muted rounded-md text-sm">{selectedReport.description}</div>
              )}
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={actionStatus} onValueChange={setActionStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REPORT_STATUS_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Optional notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReportDetailsOpen(false)}>Cancel</Button>
              <Button
                disabled={!actionStatus || actionMutation.isPending}
                onClick={() => actionMutation.mutate()}
              >
                {actionMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Reports;
