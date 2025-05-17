import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onKeepSubscription: () => void;
}

const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  onKeepSubscription,
}: CancelSubscriptionModalProps) => {
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const handleConfirm = () => {
    onConfirm();
    setStep("success");
  };

  const handleClose = () => {
    setStep("confirm");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center mb-4">
                Tem certeza que deseja cancelar sua assinatura?
              </DialogTitle>
              <DialogDescription className="text-gray-300 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <p>
                    Estamos constantemente atualizando nosso conteúdo e melhorando a plataforma para oferecer a melhor experiência possível.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p>
                    Se você não estiver satisfeito, nossa equipe está pronta para ajudar. Abra um chamado e responderemos o mais rápido possível.
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-yellow-500 mb-2">Oferta Especial!</p>
                  <p>Mantenha sua assinatura e ganhe 20% de desconto na próxima mensalidade!</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button
                variant="outline"
                onClick={onKeepSubscription}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-none"
              >
                Manter Assinatura
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                className="w-full sm:w-auto"
              >
                Cancelar Mesmo Assim
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center mb-4">
                Assinatura Cancelada
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center">
                <div className="flex flex-col items-center gap-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                  <p>
                    Sua assinatura foi cancelada com sucesso. Você continuará tendo acesso até o final do período pago.
                  </p>
                  <p className="text-sm">
                    Esperamos vê-lo novamente em breve!
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button
                onClick={handleClose}
                className="w-full"
              >
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionModal; 