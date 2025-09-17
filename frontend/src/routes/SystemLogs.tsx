import { useState, useEffect } from "react";
import LogsCategoryButton from "../components/buttons/LogsCategoryButton";
import { type SystemLogType } from "../types/systemlogs";
import SystemLogCard from "../components/SystemLogCard";

// TODO: Filters
// Pagination (optional)
export default function SystemLogsRoute() {
  const [logs, setLogs] = useState<Array<SystemLogType>>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/logs/",
        {
          mode: "cors",
          method: "GET",
          credentials: "include"
        });
      if (response.status == 403) {
        setTimeout(() => {
          fetchData();
        }, 300);
      }
      const data = await response.json();
      setLogs(data.data);
    } catch (err) {
      console.error("fetching logs failed: ", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="base-layout">
      <h1 className="self-start text-2xl font-bold">System Logs</h1>

      <div className="w-full flex flex-row justify-start gap-3">
        <LogsCategoryButton label="authentication" />
        <LogsCategoryButton label="user-management" />
        <LogsCategoryButton label="medicine-management" />
        <LogsCategoryButton label="schedule-management" />
        <LogsCategoryButton label="error" />
      </div>
      <div className="w-full pr-5 self-start">
        {logs.map((log) => {
          return (<SystemLogCard log={log} />);
        })}
      </div>
    </div>

  );
}
