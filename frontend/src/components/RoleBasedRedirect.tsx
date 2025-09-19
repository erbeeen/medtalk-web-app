import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function RoleBasedRedirect() {
  const { user } = useUser();

  // If user is not loaded yet, show loading
  if (!user) {
    return <div>Loading...</div>;
  }

  // Redirect based on user role
  switch (user.role) {
    case "super admin":
    case "doctor":
      return <Navigate to="/" replace />; // Dashboard
    case "admin":
      return <Navigate to="/users" replace />; // Users management
    case "user":
      return <Navigate to="/account" replace />; // Profile page
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
