import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

// type ProtectedRouteProps = {
//   children: React.ReactNode;
// };

export default function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await fetch("/api/auth/validate", {
          mode: "cors",
          method: "POST",
          credentials: "include",
        });

        if (response.status === 200) {
          const result = await response.json();
          setUser({ id: result.data.id, username: result.data.username, role: result.data.role });
        }

        if (response.status === 401) {
          const res = await fetch("/api/auth/refresh-token", {
            mode: "cors",
            method: "POST",
            credentials: "include",
          });

          if (res.status == 201) {
            const result = await res.json();
            setUser({ id: result.data.id, username: result.data.username, role: result.data.role });
          }

          if (res.status === 401 || res.status === 403) {
            navigate("/login");
            return;
          }

          if (res.status === 500) {
            alert("Refresh token server error, check out the error on the server.");
          }
        }
      } catch (err: any) {
        console.error("ProtectedRoute component authentication call error: ", err.stack);
      }
    }

    setIsLoading(true);
    authenticateUser();
    setIsLoading(false);

  }, []);

  return (
    <>
      {!isLoading && <Outlet />}
    </>
  );
}
