
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Users,
  Gift,
  Swords,
  Music,
  FileBarChart,
  DollarSign,
  Bell,
  Settings,
  Home,
  Menu,
  LogOut,
  ArrowRightFromLine,
  MessageSquare,
  Heart,
  UserPlus,
  User,
  BarChart2,
  ShieldAlert,
  CircleDot,
  CreditCard
} from "lucide-react";

export interface SidebarNavProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "ghost";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      variant: location.pathname === "/dashboard" ? "default" : "ghost",
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users className="w-5 h-5" />,
      variant: location.pathname === "/users" ? "default" : "ghost",
    },
    {
      title: "Gifts",
      href: "/gifts",
      icon: <Gift className="w-5 h-5" />,
      variant: location.pathname === "/gifts" ? "default" : "ghost",
    },
    {
      title: "Challenges",
      href: "/challenges",
      icon: <Swords className="w-5 h-5" />,
      variant: location.pathname === "/challenges" ? "default" : "ghost",
    },
    {
      title: "Freestyles",
      href: "/freestyles",
      icon: <Music className="w-5 h-5" />,
      variant: location.pathname === "/freestyles" ? "default" : "ghost",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileBarChart className="w-5 h-5" />,
      variant: location.pathname === "/reports" ? "default" : "ghost",
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <DollarSign className="w-5 h-5" />,
      variant: location.pathname === "/transactions" ? "default" : "ghost",
    },
    {
      title: "Withdrawals",
      href: "/withdrawals",
      icon: <CreditCard className="w-5 h-5" />,
      variant: location.pathname === "/withdrawals" ? "default" : "ghost",
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      variant: location.pathname === "/notifications" ? "default" : "ghost",
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      title: "Advanced Analytics",
      items: [
        {
          title: "Creator Insights",
          href: "/admin/creators",
          icon: <User className="w-5 h-5" />,
          variant: location.pathname === "/admin/creators" ? "default" : "ghost",
        },
        {
          title: "User Behavior",
          href: "/admin/user-behavior",
          icon: <BarChart2 className="w-5 h-5" />,
          variant: location.pathname === "/admin/user-behavior" ? "default" : "ghost",
        },
      ],
    },
    {
      title: "Social Management",
      items: [
        {
          title: "Messaging",
          href: "/admin/messaging",
          icon: <MessageSquare className="w-5 h-5" />,
          variant: location.pathname === "/admin/messaging" ? "default" : "ghost",
        },
        {
          title: "Likes",
          href: "/admin/likes",
          icon: <Heart className="w-5 h-5" />,
          variant: location.pathname === "/admin/likes" ? "default" : "ghost",
        },
        {
          title: "Following",
          href: "/admin/following",
          icon: <UserPlus className="w-5 h-5" />,
          variant: location.pathname === "/admin/following" ? "default" : "ghost",
        },
        {
          title: "Comments",
          href: "/admin/comments",
          icon: <MessageSquare className="w-5 h-5" />,
          variant: location.pathname === "/admin/comments" ? "default" : "ghost",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "System Tools",
          href: "/admin/system",
          icon: <ShieldAlert className="w-5 h-5" />,
          variant: location.pathname === "/admin/system" ? "default" : "ghost",
        },
        {
          title: "Settings",
          href: "/settings",
          icon: <Settings className="w-5 h-5" />,
          variant: location.pathname === "/settings" ? "default" : "ghost",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-20 hidden h-full w-64 flex-col border-r bg-background md:flex"
        )}
      >
        <SidebarNav />
      </aside>

      {/* Sidebar for mobile */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-end gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ isOpen, onToggle }: SidebarNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      variant: location.pathname === "/dashboard" ? "default" : "ghost",
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users className="w-5 h-5" />,
      variant: location.pathname === "/users" ? "default" : "ghost",
    },
    {
      title: "Gifts",
      href: "/gifts",
      icon: <Gift className="w-5 h-5" />,
      variant: location.pathname === "/gifts" ? "default" : "ghost",
    },
    {
      title: "Challenges",
      href: "/challenges",
      icon: <Swords className="w-5 h-5" />,
      variant: location.pathname === "/challenges" ? "default" : "ghost",
    },
    {
      title: "Freestyles",
      href: "/freestyles",
      icon: <Music className="w-5 h-5" />,
      variant: location.pathname === "/freestyles" ? "default" : "ghost",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileBarChart className="w-5 h-5" />,
      variant: location.pathname === "/reports" ? "default" : "ghost",
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <DollarSign className="w-5 h-5" />,
      variant: location.pathname === "/transactions" ? "default" : "ghost",
    },
    {
      title: "Withdrawals",
      href: "/withdrawals",
      icon: <CreditCard className="w-5 h-5" />,
      variant: location.pathname === "/withdrawals" ? "default" : "ghost",
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      variant: location.pathname === "/notifications" ? "default" : "ghost",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      variant: location.pathname === "/settings" ? "default" : "ghost",
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      title: "Advanced Analytics",
      items: [
        {
          title: "Creator Insights",
          href: "/admin/creators",
          icon: <User className="w-5 h-5" />,
          variant: location.pathname === "/admin/creators" ? "default" : "ghost",
        },
        {
          title: "User Behavior",
          href: "/admin/user-behavior",
          icon: <BarChart2 className="w-5 h-5" />,
          variant: location.pathname === "/admin/user-behavior" ? "default" : "ghost",
        },
      ],
    },
    {
      title: "Social Management",
      items: [
        {
          title: "Messaging",
          href: "/admin/messaging",
          icon: <MessageSquare className="w-5 h-5" />,
          variant: location.pathname === "/admin/messaging" ? "default" : "ghost",
        },
        {
          title: "Likes",
          href: "/admin/likes",
          icon: <Heart className="w-5 h-5" />,
          variant: location.pathname === "/admin/likes" ? "default" : "ghost",
        },
        {
          title: "Following",
          href: "/admin/following",
          icon: <UserPlus className="w-5 h-5" />,
          variant: location.pathname === "/admin/following" ? "default" : "ghost",
        },
        {
          title: "Comments",
          href: "/admin/comments",
          icon: <MessageSquare className="w-5 h-5" />,
          variant: location.pathname === "/admin/comments" ? "default" : "ghost",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "System Tools",
          href: "/admin/system",
          icon: <ShieldAlert className="w-5 h-5" />,
          variant: location.pathname === "/admin/system" ? "default" : "ghost",
        },
      ],
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold"
          onClick={onToggle}
        >
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg">Admin Dashboard</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item, index) => {
            return (
              <Button
                key={index}
                variant={item.variant}
                size="sm"
                className={cn("justify-start", {
                  "bg-primary text-white": item.href === location.pathname,
                })}
                asChild
              >
                <Link
                  to={item.href}
                  onClick={onToggle}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.title === "Notifications" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  )}
                </Link>
              </Button>
            );
          })}
          
          {user?.isAdmin && (
            <>
              <div className="mt-6 border-t pt-4">
                <h3 className="mb-2 px-2 text-sm font-medium text-muted-foreground">Admin Tools</h3>
              </div>

              {adminNavGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <h4 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                    {group.title}
                  </h4>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant={item.variant}
                        size="sm"
                        className={cn("justify-start", {
                          "bg-primary text-white": item.href === location.pathname,
                        })}
                        asChild
                      >
                        <Link
                          to={item.href}
                          onClick={onToggle}
                          className="flex items-center gap-2"
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          
                          {item.title === "Comments" && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                              2
                            </span>
                          )}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar || ""}
                alt={user?.name || "User"}
              />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => {
              if (onToggle) onToggle();
            }}
          >
            <ArrowRightFromLine className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
