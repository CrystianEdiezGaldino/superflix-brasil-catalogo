
interface DemoModeNotificationProps {
  isDemoMode: boolean;
}

const DemoModeNotification = ({ isDemoMode }: DemoModeNotificationProps) => {
  if (!isDemoMode) return null;
  
  return (
    <div className="bg-yellow-600/20 border border-yellow-600 rounded-md p-4 mb-8 text-center">
      <h3 className="text-lg font-semibold text-yellow-500 mb-2">Modo de Demonstração</h3>
      <p className="text-gray-300">
        O sistema de pagamentos está em modo de demonstração. 
        Clique em qualquer plano para receber acesso temporário gratuito por 30 dias.
      </p>
    </div>
  );
};

export default DemoModeNotification;
