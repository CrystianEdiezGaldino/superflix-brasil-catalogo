import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  days_valid: number;
  is_active: boolean;
  expires_at: string;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
}

const PromoCodesTab = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    days_valid: 7,
    expires_at: "",
    usage_limit: ""
  });
  
  // Carregar códigos promocionais
  const loadPromoCodes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error("Erro ao carregar códigos promocionais:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar códigos promocionais"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadPromoCodes();
  }, []);
  
  // Gerar código aleatório
  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };
  
  // Abrir diálogo para novo código
  const openNewCodeDialog = () => {
    setEditingCode(null);
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    
    setFormData({
      code: "",
      description: "",
      days_valid: 7,
      expires_at: twoMonthsFromNow.toISOString().split('T')[0],
      usage_limit: ""
    });
    
    setIsDialogOpen(true);
    // Gerar código aleatório ao abrir o diálogo
    generateRandomCode();
  };
  
  // Abrir diálogo para editar código
  const openEditDialog = (code: PromoCode) => {
    setEditingCode(code);
    
    // Formato de data para o input type="date"
    const expiresAtDate = new Date(code.expires_at);
    const formattedDate = expiresAtDate.toISOString().split('T')[0];
    
    setFormData({
      code: code.code,
      description: code.description || "",
      days_valid: code.days_valid,
      expires_at: formattedDate,
      usage_limit: code.usage_limit?.toString() || ""
    });
    
    setIsDialogOpen(true);
  };
  
  // Manipular alterações nos campos do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Salvar código promocional
  const handleSaveCode = async () => {
    // Validações
    if (!formData.code.trim()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "O código promocional é obrigatório"
      });
      return;
    }
    
    if (!formData.expires_at) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "A data de expiração é obrigatória"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const codeData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || null,
        days_valid: parseInt(formData.days_valid.toString()),
        expires_at: new Date(formData.expires_at).toISOString(),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        is_active: true
      };
      
      let error;
      
      if (editingCode) {
        // Atualizar código existente
        const { error: updateError } = await supabase
          .from("promo_codes")
          .update(codeData)
          .eq("id", editingCode.id);
          
        error = updateError;
      } else {
        // Inserir novo código
        const { error: insertError } = await supabase
          .from("promo_codes")
          .insert(codeData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: editingCode ? "Código atualizado com sucesso" : "Código criado com sucesso"
      });
      setIsDialogOpen(false);
      loadPromoCodes();
    } catch (error: any) {
      console.error("Erro ao salvar código promocional:", error);
      
      // Verificar erro de duplicação
      if (error.code === "23505") {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Este código já existe. Por favor, use outro código."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao salvar código promocional"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Excluir código promocional
  const handleDeleteCode = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este código promocional?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Código excluído com sucesso"
      });
      loadPromoCodes();
    } catch (error) {
      console.error("Erro ao excluir código promocional:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir código promocional"
      });
    }
  };
  
  // Copiar código para a área de transferência
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => toast({
        title: "Copiado",
        description: "Código copiado para a área de transferência"
      }))
      .catch(() => toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao copiar código"
      }));
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Códigos Promocionais</CardTitle>
          <Button onClick={openNewCodeDialog} size="sm" className="bg-green-600 hover:bg-green-700">
            <PlusCircle size={16} className="mr-2" />
            Novo Código
          </Button>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-transparent border-netflix-red rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Código</th>
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-left p-2">Dias</th>
                    <th className="text-left p-2">Expira em</th>
                    <th className="text-left p-2">Uso</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-gray-400">
                        Nenhum código promocional encontrado
                      </td>
                    </tr>
                  ) : (
                    promoCodes.map(code => {
                      const isExpired = new Date(code.expires_at) < new Date();
                      const isLimitReached = code.usage_limit !== null && code.usage_count >= code.usage_limit;
                      const isActive = code.is_active && !isExpired && !isLimitReached;
                      
                      return (
                        <tr key={code.id} className="border-b border-gray-700">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{code.code}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => copyToClipboard(code.code)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </td>
                          <td className="p-2">{code.description || "-"}</td>
                          <td className="p-2">{code.days_valid}</td>
                          <td className="p-2">{formatDate(code.expires_at)}</td>
                          <td className="p-2">
                            {code.usage_count}
                            {code.usage_limit !== null ? ` / ${code.usage_limit}` : ""}
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              isActive 
                                ? "bg-green-600 text-white" 
                                : "bg-red-600 text-white"
                            }`}>
                              {isActive ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => openEditDialog(code)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-600" 
                                onClick={() => handleDeleteCode(code.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para criar/editar código */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? "Editar Código Promocional" : "Novo Código Promocional"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm">Código</label>
                <Input 
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="Código promocional"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <Button 
                onClick={generateRandomCode}
                type="button"
                variant="outline"
                className="mb-0"
              >
                Gerar
              </Button>
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Descrição (opcional)</label>
              <Input 
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Descrição do código"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Dias de acesso</label>
              <Input 
                name="days_valid"
                type="number"
                value={formData.days_valid}
                onChange={handleFormChange}
                min={1}
                max={365}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Data de expiração</label>
              <Input 
                name="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={handleFormChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Limite de uso (opcional)</label>
              <Input 
                name="usage_limit"
                type="number"
                value={formData.usage_limit}
                onChange={handleFormChange}
                placeholder="Deixe em branco para uso ilimitado"
                min={1}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCode} 
              disabled={isSubmitting}
              className="bg-netflix-red hover:bg-netflix-red/90"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromoCodesTab;
