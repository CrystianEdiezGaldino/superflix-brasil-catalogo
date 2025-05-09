
import { useState, useEffect, useCallback, useRef } from 'react';
import { Session } from "@supabase/supabase-js";
import { checkSubscriptionStatus, processSubscriptionData } from '@/utils/subscriptionUtils';
import { toast } from "sonner";

export const useSubscriptionState = (user: any, session: Session | null) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  
  // Use refs para controlar estados de verificação
  const lastCheckTimeRef = useRef(0);
  const checkInProgressRef = useRef(false);
  const errorCountRef = useRef(0);
  const maxErrors = 3;

  // Função memoizada para verificar a assinatura
  const checkSubscription = useCallback(async () => {
    // Não verificar se não houver usuário ou sessão
    if (!user || !session) {
      setIsLoading(false);
      return;
    }

    // Evitar verificações simultâneas ou muito frequentes
    const now = Date.now();
    if (checkInProgressRef.current || (now - lastCheckTimeRef.current < 2000)) {
      return;
    }

    checkInProgressRef.current = true;
    setIsLoading(true);
    lastCheckTimeRef.current = now;
    
    try {
      const data = await checkSubscriptionStatus(user.id, session.access_token);
      
      if (!data) {
        throw new Error("Nenhum dado retornado pela verificação de assinatura");
      }
      
      // Processar os dados da assinatura
      const subscriptionState = processSubscriptionData(data);
      
      // Atualizar o estado com os dados processados
      setIsSubscribed(subscriptionState.isSubscribed);
      setIsAdmin(subscriptionState.isAdmin);
      setHasTempAccess(subscriptionState.hasTempAccess);
      setHasTrialAccess(subscriptionState.hasTrialAccess);
      setSubscriptionTier(subscriptionState.subscriptionTier);
      setSubscriptionEnd(subscriptionState.subscriptionEnd);
      setTrialEnd(subscriptionState.trialEnd);
      
      // Log de estado para debug
      console.log("Subscription state updated:", {
        isSubscribed: subscriptionState.isSubscribed,
        isAdmin: subscriptionState.isAdmin,
        hasTempAccess: subscriptionState.hasTempAccess,
        hasTrialAccess: subscriptionState.hasTrialAccess,
        tier: subscriptionState.subscriptionTier
      });
      
      // Reset error count on success
      errorCountRef.current = 0;
    } catch (error) {
      // Incrementar contador de erros
      errorCountRef.current += 1;
      console.error("Erro ao verificar assinatura:", error);
      
      // Fallback: Se falhar em verificar no backend, verificar se tem dados na Storage
      // e confiar temporariamente nesses dados para melhorar UX
      const cachedSubscription = localStorage.getItem('userSubscription');
      if (cachedSubscription) {
        try {
          const parsed = JSON.parse(cachedSubscription);
          if (parsed && parsed.expires > Date.now()) {
            console.log("Usando dados de assinatura em cache temporariamente");
            setHasTrialAccess(parsed.hasTrialAccess || false);
            setIsSubscribed(parsed.isSubscribed || false);
            setIsAdmin(parsed.isAdmin || false);
          }
        } catch (e) {
          console.error("Erro ao processar cache de assinatura:", e);
        }
      }
      
      // Só mostrar toast após múltiplas falhas para evitar spam
      if (errorCountRef.current >= maxErrors) {
        toast.error("Erro ao verificar assinatura. Tente recarregar a página.");
      }
    } finally {
      setIsLoading(false);
      checkInProgressRef.current = false;
    }
  }, [user, session]);

  // Salvar estado da assinatura em localStorage para fallback
  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem('userSubscription', JSON.stringify({
        isSubscribed,
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        expires: Date.now() + (60 * 60 * 1000), // validade de 1 hora
        updatedAt: Date.now()
      }));
    }
  }, [isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, isLoading, user]);

  // Verificação inicial quando o usuário/sessão muda
  useEffect(() => {
    if (user && session) {
      checkSubscription();
    } else {
      // Resetar estados quando não há usuário ou sessão
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setHasTrialAccess(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setTrialEnd(null);
      setIsLoading(false);
    }
  }, [user, session, checkSubscription]);

  // Verificação periódica (menos frequente)
  useEffect(() => {
    if (!user || !session) return;
    
    const intervalId = setInterval(() => {
      checkSubscription();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(intervalId);
  }, [user, session, checkSubscription]);

  return {
    isSubscribed,
    isLoading,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    checkSubscription
  };
};
