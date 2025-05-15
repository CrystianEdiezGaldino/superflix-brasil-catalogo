import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, Clock, Shield, User, Mail } from "lucide-react";
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
    <Card className="bg-netflix-dark border-netflix-red">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-netflix-red/10 rounded-lg">
              <Users className="h-5 w-5 text-netflix-red" />
            </div>
            <div>
              <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
              <p className="text-sm text-gray-400">Gerencie os usuários do sistema</p>
            </div>
          </div>
          <div className="relative w-full max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar por email..." 
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red"
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
              <TableRow className="border-b border-gray-700 bg-gray-800/50">
                <TableHead className="text-left text-white font-semibold">Email</TableHead>
                <TableHead className="text-left text-white font-semibold">Data de Registro</TableHead>
                <TableHead className="text-left text-white font-semibold">Último Login</TableHead>
                <TableHead className="text-left text-white font-semibold">Status</TableHead>
                <TableHead className="text-left text-white font-semibold">Perfil</TableHead>
                <TableHead className="text-left text-white font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-8 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-gray-600" />
                      {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge user={user} />
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                            Administrador
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="bg-gray-600/20 text-gray-400 px-2 py-1 rounded-full text-xs">
                            Usuário
                          </span>
                        </div>
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
