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
import { Search, Plus } from "lucide-react";
import { TempAccess } from "@/types/admin";

interface TempAccessTableProps {
  tempAccess: TempAccess[];
  onCreateTempAccess: () => void;
  onDeleteTempAccess: (id: string) => void;
}

export function TempAccessTable({ 
  tempAccess, 
  onCreateTempAccess, 
  onDeleteTempAccess 
}: TempAccessTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar acessos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-netflix-dark border-netflix-red text-white"
          />
        </div>
        <Button 
          onClick={onCreateTempAccess}
          className="bg-netflix-red hover:bg-netflix-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Acesso
        </Button>
      </div>

      <div className="border border-netflix-red rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-netflix-dark">
              <TableHead className="text-white">Usuário</TableHead>
              <TableHead className="text-white">Início</TableHead>
              <TableHead className="text-white">Expiração</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tempAccess
              .filter(access => 
                access.user_id.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((access) => (
                <TableRow key={access.id} className="bg-netflix-dark">
                  <TableCell className="text-white">{access.user_id}</TableCell>
                  <TableCell className="text-white">
                    {new Date(access.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-white">
                    {new Date(access.expires_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      new Date(access.expires_at) > new Date() ? "default" : "destructive"
                    }>
                      {new Date(access.expires_at) > new Date() ? "Ativo" : "Expirado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteTempAccess(access.id)}
                      className="text-red-500 border-red-500 hover:bg-red-500/10"
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 