import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
};

export default function RoleGuard({ children, allowedRoles, fallbackPath = "/unauthorized" }: RoleGuardProps) {
  const { user } = useUser();

  // If user is not loaded yet, show loading or wait
  if (!user) {
    return <div>Loading...</div>;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
