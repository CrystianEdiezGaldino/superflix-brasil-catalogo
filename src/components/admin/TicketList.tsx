import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ticketService, TicketStatus } from '@/services/ticketService';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { TicketResponseForm } from '@/components/admin/TicketResponseForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, User, Tag, Loader2 } from 'lucide-react';

const statusColors = {
  open: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  closed: 'bg-green-500/20 text-green-500 border-green-500/50',
};

const categoryLabels = {
  content: 'Conteúdo',
  subscription: 'Assinatura',
  technical: 'Técnico',
  other: 'Outro',
};

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-500 border-gray-500/50',
  medium: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
  high: 'bg-red-500/20 text-red-500 border-red-500/50',
};

export function TicketList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResponse = async () => {
    setSelectedTicket(null);
    await fetchTickets();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-netflix-red" />
      </div>
    );
  }

  const openTickets = tickets.filter(ticket => ticket.status === 'open');
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed');

  const renderTicketCard = (ticket: any) => (
    <Card key={ticket.id} className="p-4 bg-black/50 border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[ticket.status]}`}>
              {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[ticket.priority]}`}>
              {ticket.priority === 'low' ? 'Baixa' : ticket.priority === 'medium' ? 'Média' : 'Alta'}
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500">
              {categoryLabels[ticket.category as keyof typeof categoryLabels]}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
      </div>

      <p className="mt-2 text-gray-300">{ticket.description}</p>

      {ticket.admin_response && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-sm font-medium text-gray-400">Resposta do Admin:</p>
          <p className="mt-1 text-gray-300">{ticket.admin_response}</p>
        </div>
      )}

      {ticket.status !== 'closed' && (
        <div className="mt-4">
          {selectedTicket === ticket.id ? (
            <TicketResponseForm ticketId={ticket.id} onResponse={handleResponse} />
          ) : (
            <Button
              onClick={() => setSelectedTicket(ticket.id)}
              className="w-full bg-netflix-red hover:bg-red-700 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Responder
            </Button>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Tickets de Suporte</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-black/50 text-white border-gray-700">
            Total: {tickets.length}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="bg-black/50">
          <TabsTrigger value="open" className="data-[state=active]:bg-netflix-red">
            Abertos ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:bg-netflix-red">
            Fechados ({closedTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4 mt-4">
          {openTickets.map(renderTicketCard)}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4 mt-4">
          {closedTickets.map(renderTicketCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
} 