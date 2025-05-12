
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
        
        <h1 className="text-3xl font-bold mb-8 text-center">Termos de Uso e Compromissos – Naflixtv</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Natureza da Plataforma</h2>
            <p className="mb-3">
              A Naflixtv é uma plataforma de indexação e organização de conteúdos audiovisuais disponibilizados por meio de APIs públicas e de terceiros, tais como:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>TheMovieDB (TMDb)</li>
              <li>SuperFlix API</li>
            </ul>
            <p>
              Todo o conteúdo exibido na Naflixtv é proveniente exclusivamente dessas fontes externas. A Naflixtv não hospeda, armazena, transmite, nem produz qualquer conteúdo audiovisual.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Finalidade do Serviço</h2>
            <p>
              A Naflixtv tem como única finalidade facilitar o acesso público e organizado às informações disponíveis em plataformas externas. Os dados apresentados são automaticamente indexados e exibidos em formato de catálogo para melhor experiência do usuário.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Modelo de Assinatura Voluntária</h2>
            <p>
              O acesso à Naflixtv é gratuito. No entanto, os usuários podem contribuir de forma voluntária e não obrigatória com doações destinadas exclusivamente à manutenção técnica da plataforma (hospedagem, domínio, desenvolvimento etc.). Não há venda, revenda ou comercialização de conteúdo.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Isenção de Responsabilidade</h2>
            <p className="mb-3">
              A Naflixtv declara expressamente que:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Não possui vínculo com os criadores, produtores ou detentores dos direitos autorais dos conteúdos exibidos;</li>
              <li>Não é responsável por qualquer uso indevido das APIs fornecidas por terceiros;</li>
              <li>Não tem controle sobre a disponibilidade, veracidade ou legalidade dos conteúdos indexados;</li>
              <li>Não pode ser responsabilizada por qualquer infração de direitos autorais, sendo sua atuação limitada ao uso de ferramentas públicas de indexação de dados.</li>
            </ul>
            <p className="mb-3">
              Em caso de eventuais violações de direitos autorais ou outros conflitos legais, os interessados devem entrar em contato diretamente com os provedores das APIs utilizadas, a saber:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>TMDb (The Movie Database) – <a href="https://www.themoviedb.org/" className="text-netflix-red hover:underline" target="_blank" rel="noopener noreferrer">https://www.themoviedb.org/</a></li>
              <li>SuperFlixAPI – <a href="https://superflixapi.nexus/" className="text-netflix-red hover:underline" target="_blank" rel="noopener noreferrer">https://superflixapi.nexus/</a></li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Compromisso com a Legalidade</h2>
            <p>
              A Naflixtv se compromete a atender prontamente qualquer solicitação legalmente fundamentada para remoção de conteúdo indexado, desde que proveniente das plataformas originais ou de órgãos competentes.
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

export default TermsOfService;
