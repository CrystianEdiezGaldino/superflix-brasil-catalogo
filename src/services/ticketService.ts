import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type Ticket = Database['public']['Tables']['tickets']['Row'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];

export type TicketCategory = 'content' | 'subscription' | 'technical' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  admin_response?: string;
  admin_id?: string;
}

export const ticketService = {
  async createTicket(data: CreateTicketData): Promise<Ticket | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        user_id: user.user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'medium',
      } as TicketInsert)
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },

  async getUserTickets(): Promise<Ticket[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return tickets || [];
  },

  async getAllTickets(): Promise<Ticket[]> {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return tickets || [];
  },

  async updateTicket(ticketId: string, data: UpdateTicketData): Promise<Ticket | null> {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(data as TicketUpdate)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    // If this is a response from an admin, send email notification
    if (data.admin_response && data.admin_id) {
      try {
        await this.sendTicketResponseEmail(ticketId, data.admin_response, data.admin_id);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't throw the error to prevent blocking the ticket update
        // Instead, we'll just log it and continue
      }
    }

    return ticket;
  },

  async getTicketById(ticketId: string): Promise<Ticket | null> {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return ticket;
  },

  async sendTicketResponseEmail(ticketId: string, response: string, adminId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-ticket-response', {
        body: { ticketId, response, adminId }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error('Failed to send email notification');
      }
    } catch (error) {
      console.error('Error invoking Edge Function:', error);
      throw new Error('Failed to send email notification');
    }
  }
}; 