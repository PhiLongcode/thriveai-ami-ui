
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import VideoCall from "./pages/VideoCall";
import Journal from "./pages/Journal";
import MoodTracker from "./pages/MoodTracker";
import Podcast from "./pages/Podcast";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Add imports
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Doctor from "./pages/Doctor";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              {/* Add profile route */}
              <Route path="profile" element={<Profile />} />
              <Route index element={<Home />} />
              <Route path="chat" element={<Chat />} />
              <Route path="video-call" element={<VideoCall />} />
              <Route path="journal" element={<Journal />} />
              <Route path="mood-tracker" element={<MoodTracker />} />
              <Route path="podcast" element={<Podcast />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* Add admin and doctor routes outside the Layout */}
            <Route path="/admin" element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } />
            <Route path="/doctor" element={
              <PrivateRoute>
                <Doctor />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
