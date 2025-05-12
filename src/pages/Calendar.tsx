
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ContentCalendar from "@/components/calendar/ContentCalendar";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays, Tv } from "lucide-react";

// Create a component to embed the SuperFlix API frame
const SuperFlixEmbed = () => (
  <div className="mb-8 rounded-lg overflow-hidden bg-black/20 p-4">
    <div className="flex items-center gap-2 mb-4">
      <Tv size={24} className="text-primary" />
      <h2 className="text-xl font-bold">SuperFlix API - Calendário Completo</h2>
    </div>
    
    <div className="rounded-lg overflow-hidden relative w-full pt-[56.25%] md:pt-[50%] lg:pt-[40%]">
      <iframe 
        src="https://superflixapi.nexus/tv" 
        className="absolute inset-0 w-full h-full border-none"
        title="SuperFlix API Calendar"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  </div>
);

const CalendarPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"internal" | "superflix">("internal");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Na implementação real, poderíamos adicionar lógica para filtrar o calendário baseado na busca
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-24 pb-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Calendário de Lançamentos</h1>
        
        <div className="mb-6">
          <p className="text-gray-300 text-sm md:text-base">
            Confira os últimos lançamentos e saiba o que vem por aí nos próximos dias.
            Este calendário exibe conteúdo lançado nos últimos 45 dias e previsões para os próximos 20 dias.
          </p>
        </div>
        
        <Tabs defaultValue="internal" className="mb-8">
          <TabsList className="w-full md:w-auto mb-4">
            <TabsTrigger value="internal" onClick={() => setActiveView("internal")} className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Calendário NaflixTV</span>
              <span className="sm:hidden">NaflixTV</span>
            </TabsTrigger>
            <TabsTrigger value="superflix" onClick={() => setActiveView("superflix")} className="flex items-center gap-2">
              <Tv size={16} />
              <span className="hidden sm:inline">Calendário SuperFlix</span>
              <span className="sm:hidden">SuperFlix</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal" className="mt-0">
            <ContentCalendar />
          </TabsContent>
          
          <TabsContent value="superflix" className="mt-0">
            <SuperFlixEmbed />
          </TabsContent>
        </Tabs>
        
        <div className="text-xs md:text-sm text-gray-400 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-300">Notas sobre o Calendário</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Os lançamentos são atualizados diariamente através de nossas fontes e APIs.</li>
            <li>Horários podem variar conforme o fuso horário do país de origem.</li>
            <li>Para uma melhor experiência em dispositivos móveis, recomendamos usar o calendário NaflixTV.</li>
            <li>O calendário SuperFlix oferece mais detalhes, mas é otimizado para desktop.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
