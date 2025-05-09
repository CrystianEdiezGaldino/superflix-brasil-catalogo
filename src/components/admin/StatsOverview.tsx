
import { Users, UserCheck, CreditCard, CalendarClock, DollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { AdminStats } from "@/types/admin";

interface StatsOverviewProps {
  stats: AdminStats;
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <StatCard 
        title="Usuários" 
        value={stats.totalUsers} 
        icon={Users} 
      />
      
      <StatCard 
        title="Admins" 
        value={stats.adminUsers} 
        icon={UserCheck} 
      />
      
      <StatCard 
        title="Assinaturas" 
        value={stats.activeSubscriptions} 
        icon={CreditCard} 
      />
      
      <StatCard 
        title="Acessos Temp." 
        value={stats.tempAccesses} 
        icon={CalendarClock} 
      />
      
      <StatCard 
        title="Receita Mensal" 
        value={`R$${stats.monthlyRevenue.toFixed(2)}`} 
        icon={DollarSign} 
      />
      
      <StatCard 
        title="Receita Anual" 
        value={`R$${stats.yearlyRevenue.toFixed(2)}`} 
        icon={DollarSign} 
      />
    </div>
  );
};

export default StatsOverview;
