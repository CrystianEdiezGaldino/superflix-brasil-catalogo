import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { CreateTicketForm } from './CreateTicketForm';

export const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-[50px] w-[50px] rounded-full bg-netflix-red hover:bg-red-700 text-white"
          aria-label="Abrir ajuda"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-netflix-background border-netflix-red">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Solicitar Ajuda
          </DialogTitle>
        </DialogHeader>
        <CreateTicketForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}; 