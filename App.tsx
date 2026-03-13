
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Releases from "./pages/Releases";
import Press from "./pages/Press";
import Radio from "./pages/Radio";
import Photos from "./pages/Photos";
import AlbumView from "./pages/AlbumView";
import AlbumEmbed from "./pages/AlbumEmbed";
import ArtOfRave from "./pages/ArtOfRave";

import { PastEvents } from "./components/PastEvents";
import SpotifyTest from "./components/admin/SpotifyTest";




const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicPlayerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/releases" element={<Releases />} />
              <Route path="/press" element={<Press />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/art-of-rave" element={<ArtOfRave />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/album/:id" element={<AlbumView />} />
              <Route path="/album/:id/embed" element={<AlbumEmbed />} />
              <Route path="/past-events" element={<PastEvents />} />
              <Route path="/spotify-test" element={<SpotifyTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

        </MusicPlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
