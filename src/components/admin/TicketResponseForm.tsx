import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ticketService } from '@/services/ticketService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TicketResponseFormProps {
  ticketId: string;
  onResponse: () => void;
}

export function TicketResponseForm({ ticketId, onResponse }: TicketResponseFormProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await ticketService.updateTicket(ticketId, {
        admin_response: response,
        admin_id: user.id,
        status: 'closed'
      });
      setResponse('');
      onResponse();
      toast.success('Resposta enviada com sucesso!');
    } catch (error) {
      console.error('Error responding to ticket:', error);
      toast.error('Erro ao enviar resposta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Digite sua resposta..."
        className="min-h-[100px]"
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
      </Button>
    </form>
  );
} 