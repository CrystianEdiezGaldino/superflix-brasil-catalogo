
import React from "react";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/home/LoadingState";

const Animes = () => {
  // This page is temporarily disabled until the missing components and functions are implemented
  return (
    <div className="bg-netflix-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Animes</h1>
        <p>Esta página está temporariamente indisponível.</p>
      </div>
    </div>
  );
};

export default Animes;
