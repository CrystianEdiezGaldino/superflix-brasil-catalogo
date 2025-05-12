
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ContentCalendar from "@/components/calendar/ContentCalendar";
import { useState } from "react";

const Calendar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
          <p className="text-gray-300">
            Confira os últimos lançamentos e saiba o que vem por aí nos próximos dias.
            Este calendário exibe conteúdo lançado nos últimos 45 dias e previsões para os próximos 20 dias.
          </p>
        </div>
        
        <ContentCalendar />
      </div>
    </div>
  );
};

export default Calendar;
