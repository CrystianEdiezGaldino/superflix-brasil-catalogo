
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DoramaSynopsisProps {
  overview: string;
}

const DoramaSynopsis = ({ overview }: DoramaSynopsisProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // If overview is short, don't show expand button
  const isShort = overview.length < 300;

  if (!overview) {
    return (
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Sinopse</h2>
        <p className="text-gray-400">Nenhuma sinopse disponível.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Sinopse</h2>
      <div className="relative">
        <p 
          className={`text-gray-200 ${!expanded && !isShort ? 'line-clamp-3' : ''}`}
        >
          {overview}
        </p>
        
        {!isShort && (
          <Button 
            variant="ghost" 
            onClick={() => setExpanded(!expanded)} 
            className="mt-2 text-gray-400 hover:text-white p-0"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1" size={16} />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="mr-1" size={16} />
                Mostrar mais
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DoramaSynopsis;
