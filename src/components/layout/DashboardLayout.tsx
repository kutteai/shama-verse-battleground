
import { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Gift, 
  Settings, 
  LogOut, 
  Menu, 
  Flag,
  User,
  MessageSquare,
  BellRing,
  DollarSign,
  X,
  Heart,
  UserPlus,
  Award,
  BarChart2,
  Shield,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Users", icon: Users, path: "/users" },
  { name: "Challenges", icon: TrendingUp, path: "/challenges" },
  { name: "Freestyles", icon: MessageSquare, path: "/freestyles" },
  { name: "Gifts", icon: Gift, path: "/gifts" },
  { name: "Reports", icon: Flag, path: "/reports" },
  { name: "Transactions", icon: DollarSign, path: "/transactions" },
  { name: "Notifications", icon: BellRing, path: "/notifications" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const adminItems: SidebarItem[] = [
  { name: "Messaging", icon: MessageSquare, path: "/admin/messaging" },
  { name: "Likes", icon: Heart, path: "/admin/likes" },
  { name: "Following", icon: UserPlus, path: "/admin/following" },
  { name: "Creator Insights", icon: Award, path: "/admin/creators" },
  { name: "User Behavior", icon: BarChart2, path: "/admin/user-behavior" },
  { name: "Comments", icon: MessageSquare, path: "/admin/comments" },
  { name: "System Tools", icon: Terminal, path: "/admin/system" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar z-20 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ width: isSidebarOpen ? "240px" : "0", minWidth: isSidebarOpen ? "240px" : "0" }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <div className="flex items-center">
              <img 
                src="https://shamachallenge.com/img/logo.svg" 
                alt="ShamaChallenge Logo" 
                className="h-8 mr-2"
              />
              <span className="text-lg font-bold text-white">ShamaAdmin</span>
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md lg:hidden"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <nav className="flex-grow py-4 px-2 overflow-y-auto">
            <div className="mb-4">
              <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Navigation
              </h2>
              <ul className="mt-2 space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                        location.pathname === item.path && "bg-sidebar-primary text-white"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.name}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {user?.isAdmin && (
              <div className="mb-4">
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Admin Tools
                </h2>
                <ul className="mt-2 space-y-1">
                  {adminItems.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                          location.pathname === item.path && "bg-sidebar-primary text-white"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        <span>{item.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center mb-4">
              <div className="bg-slate-700 h-8 w-8 rounded-full flex items-center justify-center mr-2">
                <User size={16} className="text-white" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-2 text-white hover:bg-sidebar-accent hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 lg:px-6">
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div></div> {/* Spacer for center alignment */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => navigate('/notifications')}
            >
              <BellRing size={18} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-shama-primary"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
