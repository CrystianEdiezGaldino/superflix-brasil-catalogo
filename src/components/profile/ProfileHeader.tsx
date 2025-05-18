import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface ProfileHeaderProps {
  isAdmin: boolean;
}

const ProfileHeader = ({ isAdmin }: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Meu Perfil</h1>
    </>
  );
};

export default ProfileHeader;
