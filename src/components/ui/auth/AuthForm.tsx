
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthFormToggle from "./AuthFormToggle";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/60 p-8 rounded-lg border border-gray-700 shadow-lg backdrop-blur-sm">
        {isSignUp ? (
          <SignupForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            onSuccess={() => setIsSignUp(false)}
          />
        ) : (
          <LoginForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
          />
        )}

        <AuthFormToggle 
          isSignUp={isSignUp} 
          setIsSignUp={setIsSignUp} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AuthForm;
