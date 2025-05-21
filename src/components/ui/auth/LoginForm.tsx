import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInUser } from "@/utils/authUtils";
import { toast } from "sonner";
import { FaGooglePlay } from "react-icons/fa";
import { Download, Star } from "lucide-react";
interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}
const LoginForm = ({
  isLoading,
  setIsLoading
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await signInUser(email, password);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.message.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos");
      } else {
        toast.error(error.message || "Erro ao fazer login");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <form onSubmit={handleLogin} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-gray-400">Entre para acessar todo o conteúdo</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">E-mail</Label>
        <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => {
        setEmail(e.target.value);
        setErrors(prev => ({
          ...prev,
          email: undefined
        }));
      }} disabled={isLoading} className={`bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red ${errors.email ? 'border-red-500' : ''}`} required />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Senha</Label>
        <Input id="password" type="password" placeholder="********" value={password} onChange={e => {
        setPassword(e.target.value);
        setErrors(prev => ({
          ...prev,
          password: undefined
        }));
      }} disabled={isLoading} className={`bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red ${errors.password ? 'border-red-500' : ''}`} required />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      
      <div className="space-y-4">
        <Button type="submit" disabled={isLoading} className="w-full bg-netflix-red hover:bg-red-700">
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="text-center">
          <a href="#" className="text-gray-400 hover:text-white text-sm">
            Esqueceu sua senha?
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gray-900 text-gray-400">Ou</span>
        </div>
      </div>

      <a href="/naflixtv.apk" download className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        <Download className="text-xl transform group-hover:scale-110 transition-transform duration-300" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal group-hover:text-green-100 transition-colors duration-300">A nova versão do app está disponível.</span>
          <span className="text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">Acesso mais rápido e sem anúncios! 21/05/2025 </span>
        </div>
      </a>
      
      <div className="mt-3 bg-gray-800/50 p-3 rounded-md border border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
          <span className="text-sm font-medium text-white">Não tem uma conta?</span>
        </div>
        <p className="text-xs text-gray-400">
          Cadastre-se agora e entre para nossa lista VIP para garantir descontos especiais quando as assinaturas forem lançadas!
        </p>
      </div>
    </form>;
};
export default LoginForm;