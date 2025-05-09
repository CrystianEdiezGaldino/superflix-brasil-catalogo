
interface AuthFormToggleProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  isLoading: boolean;
}

const AuthFormToggle = ({ isSignUp, setIsSignUp, isLoading }: AuthFormToggleProps) => {
  return (
    <div className="mt-6 text-center border-t border-gray-700 pt-4">
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-netflix-red hover:text-red-400 hover:underline transition-colors"
        disabled={isLoading}
      >
        {isSignUp ? "Já tem conta? Entre" : "Não tem conta? Cadastre-se"}
      </button>
    </div>
  );
};

export default AuthFormToggle;
