
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithSubscription } from "@/types/admin";

interface TempAccessTabProps {
  tempAccesses: any[];
  users: UserWithSubscription[];
}

const TempAccessTab = ({ tempAccesses, users }: TempAccessTabProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Acessos Temporários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Usuário</th>
                <th className="text-left p-2">Concedido Por</th>
                <th className="text-left p-2">Data de Expiração</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tempAccesses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">
                    Nenhum acesso temporário encontrado
                  </td>
                </tr>
              ) : (
                tempAccesses.map((access) => {
                  const user = users.find(u => u.id === access.user_id);
                  const grantor = users.find(u => u.id === access.granted_by);
                  const isActive = new Date(access.expires_at) > new Date();
                  
                  return (
                    <tr key={access.id} className="border-b border-gray-700">
                      <td className="p-2">{user?.email || 'Usuário não encontrado'}</td>
                      <td className="p-2">{grantor?.email || 'Admin'}</td>
                      <td className="p-2">
                        {new Date(access.expires_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${
                          isActive ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {isActive ? 'Ativo' : 'Expirado'}
                        </span>
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

export default TempAccessTab;
