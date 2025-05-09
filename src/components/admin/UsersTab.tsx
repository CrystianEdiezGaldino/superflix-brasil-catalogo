
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserWithSubscription } from "@/types/admin";
import TempAccessSheet from "./TempAccessSheet";
import UserStatusBadge from "./UserStatusBadge";
import { 
  Table, 
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

interface UsersTabProps {
  users: UserWithSubscription[];
  onUserUpdate: () => void;
}

const UsersTab = ({ users, onUserUpdate }: UsersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Gerenciar Usuários</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar por email..." 
              className="pl-10 bg-gray-700 border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-left text-white">Email</TableHead>
                <TableHead className="text-left text-white">Data de Registro</TableHead>
                <TableHead className="text-left text-white">Último Login</TableHead>
                <TableHead className="text-left text-white">Status</TableHead>
                <TableHead className="text-left text-white">Perfil</TableHead>
                <TableHead className="text-left text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-4 text-gray-400">
                    {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-gray-700">
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge user={user} />
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                          Administrador
                        </span>
                      ) : (
                        <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                          Usuário
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <TempAccessSheet user={user} onSuccess={onUserUpdate} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
