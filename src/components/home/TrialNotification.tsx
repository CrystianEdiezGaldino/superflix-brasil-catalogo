
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TrialNotificationProps {
  trialEnd?: string | null;
}

const TrialNotification = ({ trialEnd = null }: TrialNotificationProps) => {
  // Format the trial end date if provided
  const formattedDate = trialEnd && isValid(parseISO(trialEnd))
    ? format(parseISO(trialEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'em breve';

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 flex items-center justify-center text-sm">
      <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
      <span>
        Você está em um período de avaliação gratuito que termina {formattedDate}.
        <a href="/subscribe" className="font-bold underline ml-2 hover:text-black/80 transition-colors">
          Assine agora
        </a>
      </span>
    </div>
  );
};

export default TrialNotification;
