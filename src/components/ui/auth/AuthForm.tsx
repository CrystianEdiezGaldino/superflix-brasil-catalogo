
import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const defaultView = searchParams.get("view") || "login";
  const [view, setView] = useState<"login" | "signup">(defaultView === "signup" ? "signup" : "login");
  const [isLoading, setIsLoading] = useState(false);

  const toggleView = () => {
    setView(view === "login" ? "signup" : "login");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
      <div className="flex border-b border-gray-800">
        <Button
          type="button"
          variant={view === "login" ? "default" : "ghost"}
          onClick={() => setView("login")}
          className={`flex-1 rounded-none border-0 ${
            view === "login" ? "bg-netflix-red hover:bg-netflix-red" : "text-gray-400 hover:text-white"
          }`}
        >
          Login
        </Button>
        <Button
          type="button"
          variant={view === "signup" ? "default" : "ghost"}
          onClick={() => setView("signup")}
          className={`flex-1 rounded-none border-0 ${
            view === "signup" ? "bg-netflix-red hover:bg-netflix-red" : "text-gray-400 hover:text-white"
          }`}
        >
          Criar Conta
        </Button>
      </div>
      <div className="p-6">
        {view === "login" ? (
          <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
        ) : (
          <SignupForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            onSuccess={() => setView("login")} 
          />
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-900 border-t border-gray-800">
        <div className="text-center">
          {view === "login" ? (
            <Button 
              variant="ghost" 
              className="underline text-gray-400 hover:text-white" 
              onClick={toggleView}
            >
              Não tem uma conta? Cadastre-se.
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="underline text-gray-400 hover:text-white" 
              onClick={toggleView}
            >
              Já tem uma conta? Faça login.
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
