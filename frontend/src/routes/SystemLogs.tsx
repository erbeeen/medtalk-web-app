import { useState, useEffect } from "react";
import LogsCategoryButton from "../components/buttons/LogsCategoryButton";
import { type SystemLogType } from "../types/systemlogs";
import SystemLogCard from "../components/SystemLogCard";

// FIX: filters do not combine (example is activating user-management and error,
// it displays all user-management and errors instead of displaying only error logs from 
// user-management)
export default function SystemLogsRoute() {
  const [logs, setLogs] = useState<Array<SystemLogType>>([]);
  const [filteredLogs, setFilteredLogs] = useState<Array<SystemLogType>>([]);
  const [filters, setFilters] = useState<Array<String>>([]);

  const updateFilters = (filterName: string, isActive: Boolean) => {
    if (isActive) {
      setFilters(prev => [...prev, filterName]);
    } else {
      const updatedFilters = filters.filter(filter => filter !== filterName);
      setFilters(updatedFilters);
    }
  };

  useEffect(() => {
    if (filters.length === 0) {
      setFilteredLogs(logs);
      return;
    }
    const updatedLogs = logs.filter((log) => {
      return filters.some((filter) => {
        if (filter === "error") {
          return log.level == filter
        }
        return log.category == filter
      });
    });
    setFilteredLogs(updatedLogs);
  }, [filters]);

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
      setFilteredLogs(data.data);
    } catch (err) {
      console.error("fetching logs failed: ", err);
    }
  }

  useEffect(() => {
    document.title = "Logs | MedTalk"
    fetchData();
  }, []);
  return (
    <div className="base-layout">
      <h1 className="self-start text-2xl font-bold">System Logs</h1>

      <div className="w-full flex flex-row justify-start gap-3">
        <LogsCategoryButton label="analytics" updateFilters={updateFilters} />
        <LogsCategoryButton label="authentication" updateFilters={updateFilters} />
        <LogsCategoryButton label="user-management" updateFilters={updateFilters} />
        <LogsCategoryButton label="admin-management" updateFilters={updateFilters} />
        <LogsCategoryButton label="medicine-management" updateFilters={updateFilters} />
        {/* <LogsCategoryButton label="schedule-management" updateFilters={updateFilters} /> */}
        <LogsCategoryButton label="error" updateFilters={updateFilters} />
      </div>
      <div className="w-full pr-5 self-start">
        {filteredLogs.map((log) => {
          return (<SystemLogCard key={log._id} log={log} />);
        })}
      </div>
    </div>

  );
}
