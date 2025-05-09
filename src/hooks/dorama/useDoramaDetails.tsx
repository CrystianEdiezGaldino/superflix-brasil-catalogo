
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDoramaData } from "./useDoramaData";
import { useDoramaPlayer } from "./useDoramaPlayer";
import { useAccessControl } from "../useAccessControl";

export const useDoramaDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Get dorama data (details and similar doramas)
  const { 
    dorama, 
    similarDoramas, 
    isLoadingDorama, 
    isLoadingSimilar 
  } = useDoramaData(id);
  
  // Handle player functionality
  const { showPlayer, togglePlayer } = useDoramaPlayer();
  
  // Handle access control
  const { 
    authLoading, 
    subscriptionLoading, 
    user, 
    hasAccess 
  } = useAccessControl();

  return {
    dorama,
    similarDoramas,
    isLoadingDorama,
    isLoadingSimilar,
    showPlayer,
    togglePlayer,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess,
  };
};

export default useDoramaDetails;
