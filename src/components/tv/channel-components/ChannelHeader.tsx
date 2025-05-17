
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { TvChannel } from "@/types/tvChannel";

interface ChannelHeaderProps {
  channel: TvChannel;
  onClose: () => void;
  isProgramInfoVisible: boolean;
  toggleProgramInfo: () => void;
}

const ChannelHeader = ({ channel, onClose, isProgramInfoVisible, toggleProgramInfo }: ChannelHeaderProps) => {
  return (
    <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {channel.logoUrl && (
            <div className="h-10 w-10 bg-white/10 rounded p-1 flex items-center justify-center">
              <img 
                src={channel.logoUrl} 
                alt={channel.name} 
                className="max-h-full max-w-full object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <DialogTitle className="text-xl font-bold text-white">
            {channel.name}
          </DialogTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/40 hover:bg-black/60 text-white"
            onClick={toggleProgramInfo}
            title="Informações da programação"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DialogDescription className="sr-only">
        {channel.description}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ChannelHeader;
