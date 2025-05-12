
import React from 'react';

const CalendarFooter = () => {
  return (
    <div className="text-xs text-gray-500 mt-2">
      <p>• Este calendário mostra lançamentos de até 45 dias atrás e 20 dias à frente do dia atual.</p>
      <p>• Exibe apenas animes/séries em andamento. Para conteúdo completo, acesse /conteudo.</p>
      <p>• Alguns episódios levam até 24h para aparecer, pois dependem de postagens do país de exibição.</p>
      <p>• Horários podem variar conforme o fuso horário do país de origem.</p>
    </div>
  );
};

export default CalendarFooter;
