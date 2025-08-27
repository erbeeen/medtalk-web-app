import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await fetch("/api/auth/validate", {
          mode: "cors",
          method: "POST",
          credentials: "include",
        });

        if (response.status === 401) {
          const res = await fetch("/api/auth/refresh-token", {
            mode: "cors",
            method: "POST",
            credentials: "include",
          });

          if (res.status === 401 || res.status === 403) {
            navigate("/login");
            return;
          }

          if (res.status === 500) {
            alert("Server Error, check out the error on the server.");
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
      {!isLoading && children}
    </>
  );
}
