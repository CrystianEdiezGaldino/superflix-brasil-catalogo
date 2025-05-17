
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithSubscription } from "@/types/admin";
import { 
  Table, 
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

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
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-left text-white">Usuário</TableHead>
                <TableHead className="text-left text-white">Concedido Por</TableHead>
                <TableHead className="text-left text-white">Data de Expiração</TableHead>
                <TableHead className="text-left text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tempAccesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-4 text-gray-400">
                    Nenhum acesso temporário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                tempAccesses.map((access) => {
                  const user = users.find(u => u.id === access.user_id);
                  const grantor = users.find(u => u.id === access.granted_by);
                  const isActive = new Date(access.expires_at) > new Date();
                  
                  return (
                    <TableRow key={access.id} className="border-b border-gray-700">
                      <TableCell>{user?.email || 'Usuário não encontrado'}</TableCell>
                      <TableCell>{grantor?.email || 'Admin'}</TableCell>
                      <TableCell>
                        {new Date(access.expires_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${
                          isActive ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {isActive ? 'Ativo' : 'Expirado'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TempAccessTab;
