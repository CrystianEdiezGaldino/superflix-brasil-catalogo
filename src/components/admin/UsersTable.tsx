import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { UserWithSubscription } from "@/types/admin";

interface UsersTableProps {
  users: UserWithSubscription[];
  onEditUser: (user: UserWithSubscription) => void;
  onGrantTempAccess: (userId: string) => void;
}

export function UsersTable({ users, onEditUser, onGrantTempAccess }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-netflix-dark border-netflix-red text-white"
            />
          </div>
          <Button variant="outline" className="border-netflix-red text-netflix-red">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      <div className="border border-netflix-red rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-netflix-dark">
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Assinatura</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter(user => 
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <TableRow key={user.id} className="bg-netflix-dark">
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_admin ? "destructive" : "default"}>
                      {user.is_admin ? "Admin" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription?.status === "active" ? "default" : "destructive"}>
                      {user.subscription?.status === "active" ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditUser(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGrantTempAccess(user.id)}
                      >
                        Acesso 30 dias
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 