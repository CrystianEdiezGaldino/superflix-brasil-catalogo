import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Shield, Mail, Calendar } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AdminsTableProps {
  admins: AdminUser[];
}

const AdminsTable = ({ admins }: AdminsTableProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-netflix-red/10 rounded-lg">
          <Shield className="h-5 w-5 text-netflix-red" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Lista de Administradores</h2>
          <p className="text-sm text-gray-400">Gerencie os administradores do sistema</p>
        </div>
      </div>
      
      <div className="border border-netflix-red rounded-lg overflow-hidden bg-netflix-dark/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-netflix-dark border-b border-netflix-red/20">
              <TableHead className="text-white font-semibold">User Id</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold">Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id} className="bg-netflix-dark hover:bg-gray-800/50 transition-colors">
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-netflix-red/20 flex items-center justify-center">
                      <span className="text-netflix-red font-semibold">{admin.name[0].toUpperCase()}</span>
                    </div>
                    {admin.name}
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {admin.email}
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(admin.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminsTable; 