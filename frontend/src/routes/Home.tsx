import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import automaticLogin from "../auth/auth";

export default function HomeRoute() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard | MedTalk";
    setIsLoading(true);

    const loginAndLoadData = async () => {
      try {
        await automaticLogin(navigate, "/");
      } catch (err) {
        console.error("login failed: ", err);
      } finally {
        setIsLoading(false);
      }
    }


    loginAndLoadData();
    setIsLoading(false);
  }, []);

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {!isLoading && (
        <Dashboard />
      )}
    </div>
  );
}
