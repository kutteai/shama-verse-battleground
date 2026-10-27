import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Gifts from "./pages/Gifts";
import Challenges from "./pages/Challenges";
import Freestyles from "./pages/Freestyles";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";
import Withdrawals from "./pages/Withdrawals";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
import MessagingManagement from "./pages/admin/MessagingManagement";
import LikesManagement from "./pages/admin/LikesManagement";
import FollowingManagement from "./pages/admin/FollowingManagement";
import CreatorInsights from "./pages/admin/CreatorInsights";
import UserBehavior from "./pages/admin/UserBehavior";
import CommentManagement from "./pages/admin/CommentManagement";
import SystemTools from "./pages/admin/SystemTools";
import PagesManagement from "./pages/admin/PagesManagement";
import ImpressionsAnalytics from "./pages/admin/ImpressionsAnalytics";
import LocationChallenges from "./pages/admin/LocationChallenges";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/gifts" element={
            <ProtectedRoute>
              <Gifts />
            </ProtectedRoute>
          } />
          
          <Route path="/challenges" element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          } />
          
          <Route path="/freestyles" element={
            <ProtectedRoute>
              <Freestyles />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />

          <Route path="/withdrawals" element={
            <ProtectedRoute>
              <Withdrawals />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/messaging" element={
            <ProtectedRoute requireAdmin={true}>
              <MessagingManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/likes" element={
            <ProtectedRoute requireAdmin={true}>
              <LikesManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/following" element={
            <ProtectedRoute requireAdmin={true}>
              <FollowingManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/creators" element={
            <ProtectedRoute requireAdmin={true}>
              <CreatorInsights />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/user-behavior" element={
            <ProtectedRoute requireAdmin={true}>
              <UserBehavior />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/comments" element={
            <ProtectedRoute requireAdmin={true}>
              <CommentManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/system" element={
            <ProtectedRoute requireAdmin={true}>
              <SystemTools />
            </ProtectedRoute>
          } />

          <Route path="/admin/pages" element={
            <ProtectedRoute requireAdmin={true}>
              <PagesManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/impressions" element={
            <ProtectedRoute requireAdmin={true}>
              <ImpressionsAnalytics />
            </ProtectedRoute>
          } />

          <Route path="/admin/location-challenges" element={
            <ProtectedRoute requireAdmin={true}>
              <LocationChallenges />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
