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
import { PromoCode } from "@/types/admin";

interface PromoCodesTableProps {
  promoCodes: PromoCode[];
  onCreatePromoCode: () => void;
  onDeletePromoCode: (code: string) => void;
}

export function PromoCodesTable({ 
  promoCodes, 
  onCreatePromoCode, 
  onDeletePromoCode 
}: PromoCodesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar códigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-netflix-dark border-netflix-red text-white"
          />
        </div>
        <Button 
          onClick={onCreatePromoCode}
          className="bg-netflix-red hover:bg-netflix-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Código
        </Button>
      </div>

      <div className="border border-netflix-red rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-netflix-dark">
              <TableHead className="text-white">Código</TableHead>
              <TableHead className="text-white">Tipo</TableHead>
              <TableHead className="text-white">Valor</TableHead>
              <TableHead className="text-white">Usos</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes
              .filter(code => 
                code.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((code) => (
                <TableRow key={code.code} className="bg-netflix-dark">
                  <TableCell className="text-white">{code.code}</TableCell>
                  <TableCell>
                    <Badge variant={code.type === "percentage" ? "default" : "secondary"}>
                      {code.type === "percentage" ? "Porcentagem" : "Valor Fixo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    {code.type === "percentage" ? `${code.value}%` : `R$ ${code.value}`}
                  </TableCell>
                  <TableCell className="text-white">{code.uses}</TableCell>
                  <TableCell>
                    <Badge variant={code.active ? "default" : "destructive"}>
                      {code.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeletePromoCode(code.code)}
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