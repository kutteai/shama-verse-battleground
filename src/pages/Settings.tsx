import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import { User, Bell, Key, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { getMyProfile, updateMyProfile, type UpdateProfilePayload } from "@/lib/adminProfileApi";
import { queryKeys } from "@/lib/queryKeys";

const GENDER_OPTIONS: Record<string, string> = {
  "1": "Male",
  "2": "Female",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: queryKeys.adminProfile,
    queryFn: getMyProfile,
  });

  const [form, setForm] = useState<UpdateProfilePayload>({});

  useEffect(() => {
    if (!profileQuery.data) return;
    const p = profileQuery.data.profile;
    setForm({
      phone: p.phone ?? "",
      about_me: p.about_me ?? "",
      talent: p.talent ?? "",
      inspiration: p.inspiration ?? "",
      hobby: p.hobby ?? "",
      fun_fact: p.fun_fact ?? "",
      gender: p.gender ?? undefined,
      profile_pic: p.profile_pic ?? "",
    });
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () => updateMyProfile(form),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.adminProfile });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleFieldChange = (field: keyof UpdateProfilePayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your platform settings.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {profileQuery.isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : profileQuery.isError || !profileQuery.data ? (
              <p className="text-sm text-destructive">Failed to load profile.</p>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your basic profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={form.profile_pic || undefined} />
                      <AvatarFallback>{profileQuery.data.profile.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="profile_pic">Profile Picture URL</Label>
                      <Input
                        id="profile_pic"
                        value={form.profile_pic ?? ""}
                        onChange={(e) => handleFieldChange("profile_pic", e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={profileQuery.data.profile.username} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileQuery.data.profile.email} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone ?? ""}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={form.gender != null ? String(form.gender) : undefined}
                        onValueChange={(value) => handleFieldChange("gender", value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(GENDER_OPTIONS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about_me">Bio</Label>
                    <Textarea
                      id="about_me"
                      value={form.about_me ?? ""}
                      onChange={(e) => handleFieldChange("about_me", e.target.value)}
                      placeholder="Write a short bio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="talent">Talent</Label>
                    <Input
                      id="talent"
                      value={form.talent ?? ""}
                      onChange={(e) => handleFieldChange("talent", e.target.value)}
                      placeholder="e.g. singing, dancing"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="inspiration">Inspiration</Label>
                      <Textarea
                        id="inspiration"
                        value={form.inspiration ?? ""}
                        onChange={(e) => handleFieldChange("inspiration", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hobby">Hobby</Label>
                      <Textarea
                        id="hobby"
                        value={form.hobby ?? ""}
                        onChange={(e) => handleFieldChange("hobby", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fun_fact">Fun Fact</Label>
                      <Textarea
                        id="fun_fact"
                        value={form.fun_fact ?? ""}
                        onChange={(e) => handleFieldChange("fun_fact", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            {/* Coming soon: no notification-preference fields exist on the User model yet. */}
            <NotAvailablePanel
              feature="Notification Preferences"
              reason="No per-channel notification preference fields exist on the user model yet."
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {/* Coming soon: no 2FA, password-change, or session-tracking infra exists yet. */}
            <NotAvailablePanel
              feature="Security Settings"
              reason="Two-factor auth, password management, and session tracking are not implemented in the backend yet."
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            {/* Coming soon: no third-party integration (Discord/Twitter/webhooks/API keys) infra exists yet. */}
            <NotAvailablePanel
              feature="Integrations"
              reason="No third-party integration or webhook infrastructure exists in the backend yet."
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
