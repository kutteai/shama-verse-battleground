
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  CalendarIcon,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  getEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  endEvent,
  type LocationChallengeEvent,
  type LocationChallengeEventPayload,
} from "@/lib/locationChallengesAdminApi";
import { queryKeys } from "@/lib/queryKeys";
import GeofencePicker, { GeofencePreview } from "@/components/location/GeofencePicker";
import { EMPTY_GEOFENCE, formatRadius, type Geofence } from "@/components/location/geofence";
import EventBrandingFields, { type EventBranding } from "@/components/location/EventBrandingFields";
import InstructionsEditor, { type InstructionDraft } from "@/components/location/InstructionsEditor";
import RichTextEditor from "@/components/location/RichTextEditor";

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

interface DatePart {
  date: Date | undefined;
  time: string;
}

const toDatePart = (iso: string | null | undefined): DatePart => {
  if (!iso) return { date: undefined, time: "09:00" };
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return { date: d, time: `${hh}:${mm}` };
};

const combineDatePart = (part: DatePart): string | null => {
  if (!part.date) return null;
  const [hh, mm] = part.time.split(":").map(Number);
  const combined = new Date(part.date);
  combined.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0);
  return combined.toISOString();
};

const EMPTY_FORM = {
  location: "",
  tag: "",
  title: "",
  description: "",
  startsAt: { date: undefined, time: "09:00" } as DatePart,
  endsAt: { date: undefined, time: "17:00" } as DatePart,
  geofence: EMPTY_GEOFENCE as Geofence,
  branding: { themeColor: "", iconUrl: "", imageUrl: "", bannerUrl: "" } as EventBranding,
  instructions: [] as InstructionDraft[],
  rules: "",
};

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

const hasGeofence = (ev: LocationChallengeEvent) =>
  ev.center_latitude != null && ev.center_longitude != null && ev.radius_meters != null;

const geofenceFromEvent = (ev: LocationChallengeEvent): Geofence =>
  hasGeofence(ev)
    ? {
        enabled: true,
        address: ev.address ?? "",
        latitude: Number(ev.center_latitude),
        longitude: Number(ev.center_longitude),
        radiusMeters: Number(ev.radius_meters),
      }
    : { ...EMPTY_GEOFENCE, address: ev.address ?? "" };

const DateTimeField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DatePart;
  onChange: (value: DatePart) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !value.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.date ? format(value.date, "LLL dd, y") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            initialFocus
            selected={value.date}
            defaultMonth={value.date}
            onSelect={(date) => onChange({ ...value, date: date ?? undefined })}
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        className="w-[110px]"
        value={value.time}
        onChange={(e) => onChange({ ...value, time: e.target.value })}
      />
    </div>
  </div>
);

const renderStatusBadge = (ev: LocationChallengeEvent) => {
  if (ev.ended_at) {
    return <Badge variant="secondary" className="text-xs">Ended</Badge>;
  }
  if (ev.is_live) {
    return <Badge className="bg-green-500 text-xs">Live</Badge>;
  }
  if (!ev.is_active) {
    return <Badge variant="outline" className="text-xs">Inactive</Badge>;
  }
  return (
    <Badge variant="outline" className="text-xs text-blue-600 border-blue-400">
      Scheduled
    </Badge>
  );
};

const LocationChallenges = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [location, setLocation] = useState("");
  const [isLiveFilter, setIsLiveFilter] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LocationChallengeEvent | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [detailEventId, setDetailEventId] = useState<string | null>(null);
  const [endTarget, setEndTarget] = useState<LocationChallengeEvent | null>(null);

  const queryClient = useQueryClient();

  const apiIsLive = isLiveFilter === "all" ? undefined : isLiveFilter === "true";

  const eventsQuery = useQuery({
    queryKey: queryKeys.locationChallengeEvents(location, isLiveFilter, search, page),
    queryFn: () =>
      getEvents({
        location: location || undefined,
        is_live: apiIsLive,
        search: search || undefined,
        page,
      }),
  });

  const events = eventsQuery.data?.results ?? [];

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: ["location-challenges", "events"] });

  const createMutation = useMutation({
    mutationFn: (payload: LocationChallengeEventPayload) => createEvent(payload),
    onSuccess: () => {
      toast.success("Event created");
      setDialogOpen(false);
      invalidateList();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: LocationChallengeEventPayload) => updateEvent(editingEvent!.id, payload),
    onSuccess: () => {
      toast.success("Event updated");
      setDialogOpen(false);
      invalidateList();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => updateEvent(id, { is_active }),
    onSuccess: () => {
      toast.success("Event status updated");
      invalidateList();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const endMutation = useMutation({
    mutationFn: (id: string) => endEvent(id),
    onSuccess: () => {
      toast.success("Event ended");
      setEndTarget(null);
      invalidateList();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const detailQuery = useQuery({
    queryKey: queryKeys.locationChallengeEventDetail(detailEventId ?? ""),
    queryFn: () => getEventDetail(detailEventId!),
    enabled: !!detailEventId,
    staleTime: 30_000,
    retry: 1,
  });

  const openCreateDialog = () => {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (ev: LocationChallengeEvent) => {
    setEditingEvent(ev);
    setForm({
      location: ev.location,
      tag: ev.tag ?? "",
      title: ev.title,
      description: ev.description ?? "",
      startsAt: toDatePart(ev.starts_at),
      endsAt: toDatePart(ev.ends_at),
      geofence: geofenceFromEvent(ev),
      branding: {
        themeColor: ev.theme_color ?? "",
        iconUrl: ev.icon_url ?? "",
        imageUrl: ev.image_url ?? "",
        bannerUrl: ev.banner_url ?? "",
      },
      instructions: [...(ev.instructions ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({ key: i.id, text: i.text, iconUrl: i.icon_url ?? "" })),
      rules: ev.rules ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.location.trim() || !form.title.trim()) {
      toast.error("Location and title are required.");
      return;
    }
    const startsAtIso = combineDatePart(form.startsAt);
    const endsAtIso = combineDatePart(form.endsAt);
    if (!startsAtIso || !endsAtIso) {
      toast.error("Start and end date/time are required.");
      return;
    }
    if (new Date(endsAtIso).getTime() <= new Date(startsAtIso).getTime()) {
      toast.error("End time must be after start time.");
      return;
    }
    const { geofence, branding } = form;
    // Blank rows are ignored; a row with an icon still needs text.
    const instructions = form.instructions.filter((i) => i.text.trim() || i.iconUrl);
    if (instructions.some((i) => !i.text.trim())) {
      toast.error("Each instruction needs text.");
      return;
    }
    if (branding.themeColor && !HEX_COLOR.test(branding.themeColor)) {
      toast.error("Theme color must be a 6-digit hex color like #2563EB.");
      return;
    }
    if (geofence.enabled && (geofence.latitude == null || geofence.longitude == null)) {
      toast.error("Place the geofence center: search an address, click the map, or type coordinates.");
      return;
    }

    const payload: LocationChallengeEventPayload = {
      location: form.location.trim(),
      tag: form.tag.trim() || undefined,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      starts_at: startsAtIso,
      ends_at: endsAtIso,
      // Turning the geofence off sends nulls, which removes it on edit.
      address: geofence.enabled ? geofence.address.trim() || null : null,
      center_latitude: geofence.enabled ? geofence.latitude : null,
      center_longitude: geofence.enabled ? geofence.longitude : null,
      radius_meters: geofence.enabled ? geofence.radiusMeters : null,
      // Empty values send null, which clears them on edit.
      theme_color: branding.themeColor || null,
      icon_url: branding.iconUrl || null,
      image_url: branding.imageUrl || null,
      banner_url: branding.bannerUrl || null,
      rules: form.rules || null,
      // Sent as one ordered list; it replaces the event's existing instructions.
      instructions: instructions.map((i, index) => ({
        text: i.text.trim(),
        icon_url: i.iconUrl || null,
        sort_order: index,
      })),
    };

    if (editingEvent) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const applySearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const applyFilters = () => {
    setLocation(locationInput.trim());
    setPage(1);
    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    setLocationInput("");
    setLocation("");
    setIsLiveFilter("all");
    setPage(1);
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const sortedLedger = [...(detailQuery.data?.ledger_entries ?? [])].sort((a, b) => b.points - a.points);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Location Challenges</h1>
            <p className="text-muted-foreground">
              Create time-boxed location events and track each event's win/loss leaderboard.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>
        </div>

        {isFiltersOpen && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g. Boston"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={isLiveFilter} onValueChange={(v) => { setIsLiveFilter(v); setPage(1); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Live</SelectItem>
                      <SelectItem value="false">Not Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <Button variant="outline" className="flex-1" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={applyFilters}>
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); applySearch(); }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by title or location..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Events
            </CardTitle>
            <CardDescription>{eventsQuery.data?.count ?? 0} event(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsQuery.isLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : eventsQuery.isError ? (
              <p className="text-sm text-destructive">Failed to load events.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No events found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((ev) => (
                      <TableRow key={ev.id}>
                        <TableCell className="font-medium max-w-[240px]">
                          <div className="flex items-center gap-2">
                            {ev.icon_url ? (
                              <img
                                src={ev.icon_url}
                                alt=""
                                className="h-7 w-7 shrink-0 rounded-md border object-cover"
                              />
                            ) : ev.theme_color ? (
                              <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: ev.theme_color }}
                              />
                            ) : null}
                            <span className="truncate">{ev.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {ev.location}
                          {ev.tag && (
                            <Badge
                              variant="outline"
                              className="ml-2 font-mono text-xs"
                              style={
                                ev.theme_color
                                  ? { borderColor: ev.theme_color, color: ev.theme_color }
                                  : undefined
                              }
                            >
                              {ev.tag}
                            </Badge>
                          )}
                          {hasGeofence(ev) && (
                            <Badge variant="secondary" className="ml-2 text-xs" title={ev.address ?? undefined}>
                              <MapPin className="h-3 w-3 mr-1" />
                              {formatRadius(Number(ev.radius_meters))}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDateTime(ev.starts_at)} &rarr; {formatDateTime(ev.ends_at)}
                        </TableCell>
                        <TableCell>{renderStatusBadge(ev)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={ev.is_active}
                            disabled={toggleActiveMutation.isPending && toggleActiveMutation.variables?.id === ev.id}
                            onCheckedChange={(checked) =>
                              toggleActiveMutation.mutate({ id: ev.id, is_active: checked })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setDetailEventId(ev.id)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                View Leaderboard
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(ev)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {!ev.ended_at && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setEndTarget(ev)}
                                  >
                                    <Power className="mr-2 h-4 w-4" />
                                    End Now
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}

            {eventsQuery.data && (eventsQuery.data.next || eventsQuery.data.previous) && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!eventsQuery.data.previous}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!eventsQuery.data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>
              While live, users in this event's area can only challenge other users in the same area.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="e.g. Boston"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Event name for the area. Users without GPS are matched by their typed location against this.
              </p>
            </div>
            <GeofencePicker
              value={form.geofence}
              onChange={(geofence) => setForm((f) => ({ ...f, geofence }))}
              onPlaceName={(name) =>
                setForm((f) => (f.location.trim() ? f : { ...f, location: name }))
              }
            />
            <div className="space-y-2">
              <Label htmlFor="event-tag">Tag (optional)</Label>
              <Input
                id="event-tag"
                placeholder="Short code shown on qualifying users, e.g. USVI — falls back to location if left blank"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                placeholder="e.g. Boston Weekend Showdown"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Optional details for this event"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <EventBrandingFields
              value={form.branding}
              onChange={(branding) => setForm((f) => ({ ...f, branding }))}
            />
            <InstructionsEditor
              value={form.instructions}
              onChange={(instructions) => setForm((f) => ({ ...f, instructions }))}
            />
            <div className="space-y-2">
              <Label>Rules</Label>
              <RichTextEditor
                value={form.rules}
                onChange={(rules) => setForm((f) => ({ ...f, rules }))}
                placeholder="Write the event rules: eligibility, scoring, conduct…"
              />
              <p className="text-xs text-muted-foreground">
                Formatting, lists and links are kept; anything else is removed when saved.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateTimeField
                label="Starts At"
                value={form.startsAt}
                onChange={(v) => setForm({ ...form, startsAt: v })}
              />
              <DateTimeField
                label="Ends At"
                value={form.endsAt}
                onChange={(v) => setForm({ ...form, endsAt: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Now confirm */}
      <AlertDialog open={!!endTarget} onOpenChange={(open) => !open && setEndTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Event Now</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this event now?
              {endTarget && (
                <span className="font-medium block mt-2">
                  "{endTarget.title}" — {endTarget.location}
                </span>
              )}
              This stops the event immediately and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => endTarget && endMutation.mutate(endTarget.id)}
              className="bg-red-700 hover:bg-red-800"
              disabled={endMutation.isPending}
            >
              {endMutation.isPending ? "Ending…" : "End Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail / Leaderboard Dialog */}
      <Dialog open={!!detailEventId} onOpenChange={(open) => { if (!open) setDetailEventId(null); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailQuery.data?.event.icon_url && (
                <img
                  src={detailQuery.data.event.icon_url}
                  alt=""
                  className="h-8 w-8 rounded-md border object-cover"
                />
              )}
              {detailQuery.data?.event.title ?? "Event Detail"}
              {detailQuery.data && renderStatusBadge(detailQuery.data.event)}
            </DialogTitle>
            {detailQuery.data?.event.description && (
              <DialogDescription>{detailQuery.data.event.description}</DialogDescription>
            )}
          </DialogHeader>

          {detailQuery.isLoading && (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
          )}
          {detailQuery.isError && (
            <p className="text-sm text-destructive py-4">Failed to load event details.</p>
          )}

          {detailQuery.data && (
            <div className="space-y-6">
              {detailQuery.data.event.banner_url && (
                <img
                  src={detailQuery.data.event.banner_url}
                  alt="Banner"
                  className="h-36 w-full rounded-md border object-cover"
                />
              )}
              {detailQuery.data.event.image_url && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Cover image
                  </p>
                  <img
                    src={detailQuery.data.event.image_url}
                    alt="Cover"
                    className="h-32 w-48 rounded-md border object-cover"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Location: <strong className="text-foreground">{detailQuery.data.event.location}</strong></span>
                {detailQuery.data.event.tag && (
                  <>
                    <span>·</span>
                    <span>Tag: <strong className="text-foreground font-mono">{detailQuery.data.event.tag}</strong></span>
                  </>
                )}
                {detailQuery.data.event.theme_color && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      Color:
                      <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: detailQuery.data.event.theme_color }}
                      />
                      <strong className="text-foreground font-mono">{detailQuery.data.event.theme_color}</strong>
                    </span>
                  </>
                )}
                <span>·</span>
                <span>
                  Window: <strong className="text-foreground">
                    {formatDateTime(detailQuery.data.event.starts_at)} &rarr; {formatDateTime(detailQuery.data.event.ends_at)}
                  </strong>
                </span>
                {detailQuery.data.event.ended_at && (
                  <>
                    <span>·</span>
                    <span>Ended: <strong className="text-foreground">{formatDateTime(detailQuery.data.event.ended_at)}</strong></span>
                  </>
                )}
                {detailQuery.data.event.created_by_username && (
                  <>
                    <span>·</span>
                    <span>Created by: <strong className="text-foreground">@{detailQuery.data.event.created_by_username}</strong></span>
                  </>
                )}
              </div>

              {hasGeofence(detailQuery.data.event) && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Geofence · {formatRadius(Number(detailQuery.data.event.radius_meters))} radius
                  </p>
                  {detailQuery.data.event.address && (
                    <p className="text-sm">{detailQuery.data.event.address}</p>
                  )}
                  <GeofencePreview
                    latitude={Number(detailQuery.data.event.center_latitude)}
                    longitude={Number(detailQuery.data.event.center_longitude)}
                    radiusMeters={Number(detailQuery.data.event.radius_meters)}
                  />
                </div>
              )}

              {detailQuery.data.event.instructions?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Instructions
                  </p>
                  <ol className="space-y-2">
                    {[...detailQuery.data.event.instructions]
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((step, index) => (
                        <li key={step.id} className="flex items-center gap-3 text-sm">
                          <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                            {index + 1}
                          </span>
                          {step.icon_url ? (
                            <img src={step.icon_url} alt="" className="h-8 w-8 rounded-md border object-cover" />
                          ) : (
                            <span className="h-8 w-8 rounded-md border bg-muted" />
                          )}
                          <span>{step.text}</span>
                        </li>
                      ))}
                  </ol>
                </div>
              )}

              {detailQuery.data.event.rules && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Rules
                  </p>
                  {/* Sanitized server-side (nh3) before it is stored. */}
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-3"
                    dangerouslySetInnerHTML={{ __html: detailQuery.data.event.rules }}
                  />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Leaderboard
                </p>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead className="text-right">Wins</TableHead>
                          <TableHead className="text-right">Losses</TableHead>
                          <TableHead className="text-right">Ties</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                          <TableHead className="text-right">Played</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedLedger.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                              No participants yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedLedger.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={entry.user.profile_pic ?? undefined} />
                                    <AvatarFallback>{entry.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">@{entry.user.username}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{entry.wins}</TableCell>
                              <TableCell className="text-right">{entry.losses}</TableCell>
                              <TableCell className="text-right">{entry.ties}</TableCell>
                              <TableCell className="text-right font-semibold">{entry.points}</TableCell>
                              <TableCell className="text-right">{entry.challenges_count}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {sortedLedger.length} of {sortedLedger.length} participants
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LocationChallenges;
