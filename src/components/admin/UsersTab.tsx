
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserWithSubscription } from "@/types/admin";
import TempAccessSheet from "./TempAccessSheet";
import UserStatusBadge from "./UserStatusBadge";

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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Data de Registro</th>
                <th className="text-left p-2">Último Login</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Perfil</th>
                <th className="text-left p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-2">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}
                    </td>
                    <td className="p-2">
                      <UserStatusBadge user={user} />
                    </td>
                    <td className="p-2">
                      {user.is_admin ? (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                          Administrador
                        </span>
                      ) : (
                        <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      <TempAccessSheet user={user} onSuccess={onUserUpdate} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
