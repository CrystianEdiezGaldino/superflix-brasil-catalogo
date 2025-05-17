
import React from "react";
import { UserWithSubscription } from "@/types/admin";

interface UserStatusBadgeProps {
  user: UserWithSubscription;
}

const UserStatusBadge = ({ user }: UserStatusBadgeProps) => {
  if (user.subscription?.status === 'active') {
    return (
      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
        Assinante {user.subscription?.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
      </span>
    );
  } else if (user.temp_access) {
    return (
      <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">
        Acesso Temp. até {new Date(user.temp_access.expires_at).toLocaleDateString('pt-BR')}
      </span>
    );
  } else {
    return (
      <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
        Sem Assinatura
      </span>
    );
  }
};

export default UserStatusBadge;
