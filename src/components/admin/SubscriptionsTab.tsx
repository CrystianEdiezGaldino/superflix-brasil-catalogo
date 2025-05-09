
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithSubscription } from "@/types/admin";

interface SubscriptionsTabProps {
  subscriptions: any[];
  users: UserWithSubscription[];
}

const SubscriptionsTab = ({ subscriptions, users }: SubscriptionsTabProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Assinaturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Usuário</th>
                <th className="text-left p-2">Tipo de Plano</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Data de Término</th>
                <th className="text-left p-2">ID do Cliente Stripe</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">
                    Nenhuma assinatura encontrada
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => {
                  const user = users.find(u => u.id === subscription.user_id);
                  return (
                    <tr key={subscription.id} className="border-b border-gray-700">
                      <td className="p-2">{user?.email || 'Usuário não encontrado'}</td>
                      <td className="p-2">
                        {subscription.plan_type === 'monthly' ? 'Mensal' : 
                         subscription.plan_type === 'annual' ? 'Anual' : subscription.plan_type}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${
                          subscription.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {subscription.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-2">
                        {subscription.current_period_end ? 
                          new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : 
                          'N/A'}
                      </td>
                      <td className="p-2 truncate max-w-[150px]">
                        {subscription.stripe_customer_id || 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsTab;
