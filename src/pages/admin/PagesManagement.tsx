import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";

import { listPages, createPage, updatePage, deletePage, type AdminPage } from "@/lib/pagesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

const EMPTY_FORM = { name: "", title: "", is_active: true };

const PagesManagement = () => {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AdminPage | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const queryClient = useQueryClient();

  const pagesQuery = useQuery({
    queryKey: queryKeys.pagesAdmin(page),
    queryFn: () => listPages(page),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["pages", "admin"] });

  const createMutation = useMutation({
    mutationFn: () => createPage({ name: form.name.trim(), title: form.title.trim(), is_active: form.is_active }),
    onSuccess: () => {
      toast.success("Page created — give this name to the mobile team");
      setDialogOpen(false);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePage(editingPage!.id, { name: form.name.trim(), title: form.title.trim(), is_active: form.is_active }),
    onSuccess: () => {
      toast.success("Page updated");
      setDialogOpen(false);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePage(id),
    onSuccess: () => {
      toast.success("Page deleted");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreateDialog = () => {
    setEditingPage(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (p: AdminPage) => {
    setEditingPage(p);
    setForm({ name: p.name, title: p.title, is_active: p.is_active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.title.trim()) {
      toast.error("Name and title are required.");
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(form.name.trim())) {
      toast.error("Name must be lowercase letters, numbers, hyphens or underscores only — this is the key mobile uses.");
      return;
    }
    if (editingPage) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleDelete = (p: AdminPage) => {
    if (!window.confirm(`Delete page "${p.name}"? Mobile screens still requesting this key will get nothing back.`)) return;
    deleteMutation.mutate(p.id);
  };

  const pages = pagesQuery.data?.results ?? [];
  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            <p className="text-muted-foreground">
              Screens the mobile app can report views for. Create a page here, then give its name to the mobile team.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              All Pages
            </CardTitle>
            <CardDescription>{pagesQuery.data?.count ?? 0} page(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {pagesQuery.isLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : pagesQuery.isError ? (
              <p className="text-sm text-destructive">Failed to load pages.</p>
            ) : pages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pages yet — create one to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Avg. Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.name}</TableCell>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>
                        {p.is_active ? (
                          <Badge className="bg-green-500 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{p.view_count.toLocaleString()}</TableCell>
                      <TableCell>{p.avg_duration_seconds}s</TableCell>
                      <TableCell>{formatDate(p.created_at)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {pagesQuery.data && (pagesQuery.data.next || pagesQuery.data.previous) && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={!pagesQuery.data.previous} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={!pagesQuery.data.next} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Page" : "Create Page"}</DialogTitle>
            <DialogDescription>
              The name is the stable key mobile uses to request/report this screen — avoid changing it once shared.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="page-name">Name (key)</Label>
              <Input
                id="page-name"
                placeholder="e.g. home, profile, onboarding_1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-title">Title</Label>
              <Input
                id="page-title"
                placeholder="e.g. Home Screen"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="page-active">Active</Label>
              <Switch
                id="page-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingPage ? "Save Changes" : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PagesManagement;
