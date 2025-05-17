import React, { useState } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Animes from "./pages/Animes";
import Favorites from "@/pages/Favorites";
import Doramas from "./pages/Doramas";
import DoramaDetails from "./pages/DoramaDetails";
import MovieDetails from "./pages/MovieDetails";
import SeriesDetails from "./pages/SeriesDetails";
import AnimeDetails from "./pages/AnimeDetails";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Subscribe from "./pages/Subscribe";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Admin from "./pages/Admin";
import Kids from "./pages/Kids";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TvChannels from "./pages/TvChannels";
import Search from "./pages/Search";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <SonnerToaster />
            <Toaster />
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/filmes" element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              } />
              <Route path="/series" element={
                <ProtectedRoute>
                  <Series />
                </ProtectedRoute>
              } />
              <Route path="/filme/:id" element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              } />
              <Route path="/serie/:id" element={
                <ProtectedRoute>
                  <SeriesDetails />
                </ProtectedRoute>
              } />
              <Route path="/animes" element={
                <ProtectedRoute>
                  <Animes />
                </ProtectedRoute>
              } />
              <Route path="/anime/:id" element={
                <ProtectedRoute>
                  <AnimeDetails />
                </ProtectedRoute>
              } />
              <Route path="/doramas" element={
                <ProtectedRoute>
                  <Doramas />
                </ProtectedRoute>
              } />
              <Route path="/dorama/:id" element={
                <ProtectedRoute>
                  <DoramaDetails />
                </ProtectedRoute>
              } />
              <Route path="/kids" element={
                <ProtectedRoute>
                  <Kids />
                </ProtectedRoute>
              } />
              <Route path="/tv-channels" element={
                <ProtectedRoute>
                  <TvChannels />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/favoritos" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/subscribe" element={
                <ProtectedRoute>
                  <Subscribe />
                </ProtectedRoute>
              } />
              <Route path="/subscription-success" element={
                <ProtectedRoute>
                  <SubscriptionSuccess />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/termos-de-servico" element={<TermsOfService />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
