
interface AuthFormToggleProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  isLoading: boolean;
}

const AuthFormToggle = ({ isSignUp, setIsSignUp, isLoading }: AuthFormToggleProps) => {
  return (
    <div className="mt-8 text-center border-t border-gray-700 pt-6">
      <p className="text-gray-400 mb-3">
        {isSignUp ? "Já possui uma conta?" : "Ainda não tem uma conta?"}
      </p>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-netflix-red hover:text-red-400 font-medium hover:underline transition-colors"
        disabled={isLoading}
      >
        {isSignUp ? "Entre agora" : "Cadastre-se grátis"}
      </button>
    </div>
  );
};

export default AuthFormToggle;
