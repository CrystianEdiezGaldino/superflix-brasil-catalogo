import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Clock, DollarSign } from "lucide-react";
import { AdminStats } from "@/types/admin";

interface AdminOverviewProps {
  stats: AdminStats;
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-netflix-dark border-netflix-red">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Total de Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-netflix-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
        </CardContent>
      </Card>

      <Card className="bg-netflix-dark border-netflix-red">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Assinaturas Ativas
          </CardTitle>
          <CreditCard className="h-4 w-4 text-netflix-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
        </CardContent>
      </Card>

      <Card className="bg-netflix-dark border-netflix-red">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Acessos Temporários
          </CardTitle>
          <Clock className="h-4 w-4 text-netflix-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.tempAccess}</div>
        </CardContent>
      </Card>

      <Card className="bg-netflix-dark border-netflix-red">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Receita Mensal
          </CardTitle>
          <DollarSign className="h-4 w-4 text-netflix-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            R$ {stats.monthlyRevenue.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 