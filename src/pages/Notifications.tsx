
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Bell, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";

import {
  listCampaigns,
  broadcastNotification,
  scheduleNotificationCampaign,
  type RecipientType,
} from "@/lib/notificationsAdminApi";
import { queryKeys } from "@/lib/queryKeys";

// Templates stored in localStorage — no server model needed
const TEMPLATES_KEY = "admin_notification_templates";

interface Template { id: string; title: string; content: string }

function loadTemplates(): Template[] {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveTemplates(templates: Template[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

const RECIPIENT_LABELS: Record<RecipientType, string> = {
  all: "All Active Users",
  active: "Recently Active (30 days)",
  specific: "Specific Users (by ID)",
};

const STATUS_BADGE = {
  sent: <Badge className="bg-green-500 text-xs">Sent</Badge>,
  pending: <Badge variant="outline" className="text-yellow-600 border-yellow-500 text-xs">Pending</Badge>,
  failed: <Badge variant="destructive" className="text-xs">Failed</Badge>,
};

const formatDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
    : "—";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [specificIds, setSpecificIds] = useState("");
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [templates, setTemplates] = useState<Template[]>(loadTemplates);
  const [newTemplateName, setNewTemplateName] = useState("");

  const queryClient = useQueryClient();

  const campaignsQuery = useQuery({
    queryKey: queryKeys.notificationCampaigns(1),
    queryFn: () => listCampaigns(1),
    enabled: activeTab === "sent",
  });

  const broadcastMutation = useMutation({
    mutationFn: () =>
      broadcastNotification({
        title,
        message: content,
        recipient_type: recipientType,
        user_ids: recipientType === "specific" ? specificIds.split(",").map((s) => Number(s.trim())).filter(Boolean) : undefined,
      }),
    onSuccess: () => {
      toast.success("Broadcast queued — your Celery worker will deliver it shortly");
      resetForm();
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationCampaigns(1) });
      setActiveTab("sent");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      scheduleNotificationCampaign({
        title,
        message: content,
        recipient_type: recipientType,
        user_ids: recipientType === "specific" ? specificIds.split(",").map((s) => Number(s.trim())).filter(Boolean) : undefined,
        scheduled_for: new Date(scheduledFor).toISOString(),
      }),
    onSuccess: () => {
      toast.success("Campaign scheduled");
      resetForm();
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationCampaigns(1) });
      setActiveTab("sent");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setRecipientType("all");
    setSpecificIds("");
    setScheduleMode(false);
    setScheduledFor("");
  };

  const handleSend = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and message are required.");
      return;
    }
    if (scheduleMode) {
      if (!scheduledFor) { toast.error("Pick a date/time to schedule."); return; }
      scheduleMutation.mutate();
    } else {
      broadcastMutation.mutate();
    }
  };

  const saveAsTemplate = () => {
    if (!newTemplateName.trim() || !title.trim() || !content.trim()) {
      toast.error("Fill in template name, title, and content first.");
      return;
    }
    const next: Template[] = [
      ...templates,
      { id: crypto.randomUUID(), title: `${newTemplateName}: ${title}`, content },
    ];
    setTemplates(next);
    saveTemplates(next);
    setNewTemplateName("");
    toast.success("Template saved locally");
  };

  const loadTemplate = (t: Template) => {
    const [, ...rest] = t.title.split(": ");
    setTitle(rest.join(": ") || t.title);
    setContent(t.content);
  };

  const deleteTemplate = (id: string) => {
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    saveTemplates(next);
  };

  const isPending = broadcastMutation.isPending || scheduleMutation.isPending;
  const campaigns = campaignsQuery.data?.results ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Broadcast messages to your users.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose" className="flex items-center gap-1">
              <Bell size={15} />
              Compose
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-1">
              <CheckCircle size={15} />
              Campaign History
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <Clock size={15} />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Notification</CardTitle>
                <CardDescription>Send a push notification to a group of users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Notification title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Notification message..."
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select value={recipientType} onValueChange={(v) => setRecipientType(v as RecipientType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Users</SelectItem>
                      <SelectItem value="active">Recently Active (30 days)</SelectItem>
                      <SelectItem value="specific">Specific Users (by ID)</SelectItem>
                    </SelectContent>
                  </Select>
                  {recipientType === "specific" && (
                    <div className="mt-2 space-y-1">
                      <Label className="text-xs text-muted-foreground">Comma-separated user IDs</Label>
                      <Input
                        placeholder="e.g. 1, 2, 5"
                        value={specificIds}
                        onChange={(e) => setSpecificIds(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Switch id="schedule-toggle" checked={scheduleMode} onCheckedChange={setScheduleMode} />
                  <Label htmlFor="schedule-toggle">Schedule for later</Label>
                </div>

                {scheduleMode && (
                  <div className="space-y-2">
                    <Label>Schedule Date &amp; Time</Label>
                    <Input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Campaign will be dispatched within 5 minutes of the scheduled time.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button onClick={handleSend} disabled={isPending} className="flex items-center gap-2">
                  {scheduleMode ? <Clock size={16} /> : <Send size={16} />}
                  {isPending ? "Sending…" : scheduleMode ? "Schedule" : "Send Now"}
                </Button>
                <Button variant="ghost" onClick={resetForm}>Clear</Button>
              </CardFooter>
            </Card>

            {/* Quick save to template */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Save as Template</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Input
                  placeholder="Template name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={saveAsTemplate}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign History Tab */}
          <TabsContent value="sent" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>All admin notification campaigns (broadcast and scheduled).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {campaignsQuery.isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : campaignsQuery.isError ? (
                  <div className="p-4 text-sm text-destructive">Failed to load campaigns.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            <AlertCircle className="mx-auto mb-2" size={32} />
                            No campaigns sent yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        campaigns.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium max-w-[180px] truncate">{c.title}</TableCell>
                            <TableCell className="text-sm capitalize">{RECIPIENT_LABELS[c.recipient_type]}</TableCell>
                            <TableCell>{c.recipient_count}</TableCell>
                            <TableCell>{STATUS_BADGE[c.status] ?? c.status}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(c.sent_at)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(c.scheduled_for)}</TableCell>
                            <TableCell className="text-sm">@{c.admin_user?.username ?? "—"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            {templates.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No templates saved yet. Compose a notification and save it as a template.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((t) => (
                  <Card key={t.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{t.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{t.content}</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button size="sm" variant="outline" onClick={() => { loadTemplate(t); setActiveTab("compose"); }}>
                        Use Template
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteTemplate(t.id)}>
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
