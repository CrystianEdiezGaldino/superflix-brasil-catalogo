
const ErrorState = () => {
  return (
    <div className="min-h-screen bg-netflix-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar conteúdo</h1>
        <p className="text-gray-400">Tente novamente mais tarde.</p>
      </div>
    </div>
  );
};

export default ErrorState;
