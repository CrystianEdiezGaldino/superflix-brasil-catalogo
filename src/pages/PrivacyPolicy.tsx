import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    // Implementação de busca se necessário
  };
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="container max-w-4xl mx-auto px-4 py-24 text-white">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:text-netflix-red transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center">Política de Privacidade – Naflixtv</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Coleta de Dados</h2>
            <p className="mb-3">
              A Naflixtv coleta apenas as informações necessárias para o funcionamento da plataforma:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Email e senha para autenticação</li>
              <li>Nome do usuário para identificação</li>
              <li>Preferências de conteúdo para personalização</li>
            </ul>
            <p>
              Não coletamos dados sensíveis ou informações de pagamento, já que não realizamos transações financeiras.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Uso das Informações</h2>
            <p>
              As informações coletadas são utilizadas exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Autenticação e segurança da conta</li>
              <li>Personalização da experiência do usuário</li>
              <li>Comunicação sobre atualizações do serviço</li>
              <li>Melhorias na plataforma</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Compartilhamento de Dados</h2>
            <p>
              Não compartilhamos dados dos usuários com terceiros. As informações são utilizadas apenas internamente para o funcionamento da plataforma.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Segurança</h2>
            <p className="mb-3">
              Implementamos medidas de segurança para proteger as informações dos usuários:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Criptografia de dados sensíveis</li>
              <li>Autenticação segura</li>
              <li>Proteção contra acessos não autorizados</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies apenas para manter a sessão do usuário e melhorar a experiência de navegação. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Direitos do Usuário</h2>
            <p>
              Os usuários têm direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Acessar seus dados pessoais</li>
              <li>Solicitar a exclusão de sua conta</li>
              <li>Atualizar suas informações</li>
              <li>Exportar seus dados</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Contato</h2>
            <p>
              Para questões relacionadas à privacidade, entre em contato através do email de suporte.
            </p>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            Última atualização: 12 de Maio de 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 