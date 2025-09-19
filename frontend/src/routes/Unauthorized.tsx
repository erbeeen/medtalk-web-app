import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { FaExclamationTriangle } from "react-icons/fa";

export default function UnauthorizedRoute() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Unauthorized Access | MedTalk";
  }, []);

  const handleGoBack = () => {
    // Redirect based on user role
    if (user?.role === "user") {
      navigate("/account");
    } else if (user?.role === "doctor") {
      navigate("/medicine");
    } else if (user?.role === "admin") {
      navigate("/users");
    } else if (user?.role === "super admin") {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[60vh]">
      <div className="max-w-md w-full text-center bg-gray-800/20 dark:bg-gray-800/30 rounded-xl p-8 shadow-lg">
        <FaExclamationTriangle className="text-yellow-500 mx-auto mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-light-text/70 dark:text-dark-text/70 mb-6">
          You don't have permission to access this page. Your current role ({user?.role || "unknown"}) 
          doesn't have the required privileges.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
