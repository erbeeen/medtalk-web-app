import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUser();
  const navigate = useNavigate();
  let refreshIntervalId: NodeJS.Timeout | null = null;

  const callAuthenticate = async () => {
    setIsLoading(true);
    await authenticateUser();
    setIsLoading(false);
  }

  const refreshAccesToken = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh-token", {
        mode: "cors",
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/login");
        return false;
      } else if (res.status === 500) {
        alert("Refresh token server error, check out the error on the server.");
        return false;
      } else {
        const result = await res.json();
        setUser({ id: result.data.id, username: result.data.username, role: result.data.role });
        return true;
      }
    } catch (err: any) {
      console.error("ProtectedRoute component refreshAccessToken error: ", err.stack);
      return false;
    }
  }

  const authenticateUser = async () => {
    try {
      const response = await fetch("/api/auth/validate", {
        mode: "cors",
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        if (window.location.pathname == "/login") {
          navigate(-1);
        }

        const result = await response.json();
        setUser({ id: result.data.id, username: result.data.username, role: result.data.role });
      }

      if (response.status === 401) {
        const result = await refreshAccesToken();
        if (result) 
          window.location.reload();
      }
    } catch (err: any) {
      console.error("ProtectedRoute component authentication call error: ", err.stack);
      navigate("/login");
    }
  }

  useEffect(() => {
    callAuthenticate();

    if (!refreshIntervalId) {
      refreshIntervalId = setInterval(() => {
        refreshAccesToken();
      }, 28 * 60 * 1000);
    }

    // return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <>
      {!isLoading && <Outlet />}
    </>
  );
}
