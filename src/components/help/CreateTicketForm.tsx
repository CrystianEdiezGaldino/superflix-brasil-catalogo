import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ticketService, TicketCategory } from '@/services/ticketService';

const formSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres'),
  category: z.enum(['content', 'subscription', 'technical', 'other'] as const),
});

interface CreateTicketFormProps {
  onSuccess?: () => void;
}

export const CreateTicketForm = ({ onSuccess }: CreateTicketFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'technical',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await ticketService.createTicket({
        title: values.title,
        description: values.description,
        category: values.category
      });
      toast.success('Ticket criado com sucesso! Você receberá a resposta por email.', {
        duration: 5000,
        description: 'Nossa equipe irá analisar sua solicitação e responder o mais breve possível.'
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Erro ao criar ticket. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o título do seu problema"
                  className="bg-black/50 border-gray-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-netflix-background border-netflix-red">
                  <SelectItem value="content">Conteúdo não disponível</SelectItem>
                  <SelectItem value="subscription">Problema com assinatura</SelectItem>
                  <SelectItem value="technical">Problema técnico</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva seu problema em detalhes"
                  className="bg-black/50 border-gray-700 text-white min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-netflix-red hover:bg-red-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
        </Button>
      </form>
    </Form>
  );
}; 