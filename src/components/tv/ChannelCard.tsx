
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TvChannel } from '@/types/tvChannel';
import { Tv } from 'lucide-react';

interface ChannelCardProps {
  channel: TvChannel;
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div 
        className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-105 hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt={channel.name} 
            className="w-full h-full object-contain p-2" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Tv className="h-10 w-10 text-white" />
          </div>
        )}
        
        <div className="fallback-icon hidden flex items-center justify-center h-full absolute inset-0">
          <Tv className="h-10 w-10 text-white" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
          <p className="text-white font-medium text-sm">{channel.name}</p>
        </div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black border border-gray-800 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-800">
            <DialogTitle className="text-white">{channel.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full w-full">
            <iframe 
              src={channel.embedUrl} 
              className="w-full h-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelCard;
