import { useEffect } from "react";
import Dashboard from "../components/Dashboard";

export default function HomeRoute() {
  useEffect(() => {
    document.title = "Dashboard | MedTalk"
  })

  return (
      <Dashboard />
  );
}
