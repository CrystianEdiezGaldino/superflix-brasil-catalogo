
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
          <Icon size={16} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
