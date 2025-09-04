import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";

export default function HomeRoute() {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    document.title = "Dashboard | MedTalk";

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const loadData = async () => {
      try {
        await delay(1500);
        setIsLoading(false);
      } catch (err) {
        console.error("login failed: ", err);
      } finally {
        setIsLoading(false);
      }
    }


    setIsLoading(true);
    loadData();
  }, []);

  return !isLoading && (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <Dashboard />
    </div>
  );
}
