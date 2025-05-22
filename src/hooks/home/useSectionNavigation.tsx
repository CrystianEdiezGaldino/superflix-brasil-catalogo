
import { useState } from "react";

export const useSectionNavigation = () => {
  const [currentSection, setCurrentSection] = useState<string>("movies");
  
  return {
    currentSection,
    setCurrentSection
  };
};
