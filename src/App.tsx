import React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
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
import Profile from "./pages/Profile";
import Subscribe from "./pages/Subscribe";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Admin from "./pages/Admin";
import Kids from "./pages/Kids";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/filmes" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/filme/:id" element={<MovieDetails />} />
                <Route path="/serie/:id" element={<SeriesDetails />} />
                <Route path="/animes" element={<Animes />} />
                <Route path="/anime/:id" element={<AnimeDetails />} />
                <Route path="/doramas" element={<Doramas />} />
                <Route path="/dorama/:id" element={<DoramaDetails />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
