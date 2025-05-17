
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthFormToggle from "./AuthFormToggle";
import { motion } from "framer-motion";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-black/70 p-8 rounded-lg border border-gray-700 shadow-xl backdrop-blur-lg"
      >
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
      </motion.div>
    </div>
  );
};

export default AuthForm;
