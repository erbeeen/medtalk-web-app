import { useEffect } from "react";
import Dashboard from "../components/Dashboard";

export default function HomeRoute() {
  useEffect(() => {
    document.title = "Dashboard | MedTalk";
  }, []);

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <Dashboard />
    </div>
  );
}
