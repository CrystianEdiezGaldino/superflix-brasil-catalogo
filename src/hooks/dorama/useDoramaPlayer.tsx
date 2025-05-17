
import { useState, useEffect } from "react";

export const useDoramaPlayer = () => {
  const [showPlayer, setShowPlayer] = useState(false);

  // Toggle player visibility
  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    showPlayer,
    togglePlayer
  };
};
