import { useState, useEffect } from "react";
import LogsCategoryButton from "../components/buttons/LogsCategoryButton";
import { type SystemLogType } from "../types/systemlogs";
import SystemLogCard from "../components/SystemLogCard";

export default function SystemLogsRoute() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<Array<SystemLogType>>([]);
  const [filteredLogs, setFilteredLogs] = useState<Array<SystemLogType>>([]);
  const [filters, setFilters] = useState<Array<String>>([]);
  const [isErrorFilterOn, setIsErrorFilterOn] = useState(false);

  const updateFilters = (filterName: string, isActive: Boolean) => {
    if (isActive) {
      setFilters(prev => [...prev, filterName]);
    } else {
      const updatedFilters = filters.filter(filter => filter !== filterName);
      setFilters(updatedFilters);
    }
  };

  useEffect(() => {
    if (isErrorFilterOn) {
      const updatedLogs = logs.filter((log) => {
        if (filters.length === 0) {
          return log.level === "error";
        } else {
          return filters.some((filter) => {
            if (isErrorFilterOn)
              return log.level === "error" && log.category == filter;
          });
        }
      });
      setFilteredLogs(updatedLogs);
    }
  }, [isErrorFilterOn]);

  useEffect(() => {
    if (filters.length === 0 && !isErrorFilterOn) {
      setFilteredLogs(logs);
      return;
    } 

    if (filters.length === 0 && isErrorFilterOn) {
      const updatedLogs = logs.filter((log) => {
        return log.level === "error";
      })
      setFilteredLogs(updatedLogs);
      return;
    }

    const updatedLogs = logs.filter((log) => {
      return filters.some((filter) => {
        if (isErrorFilterOn) {
          return log.level === "error" && log.category == filter;
        }
        return log.category == filter
      });
    });
    setFilteredLogs(updatedLogs);
  }, [filters]);



  useEffect(() => {
    document.title = "Logs | MedTalk"

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

    const loadData = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="base-layout">
      <h1 className="self-start text-2xl font-bold">System Logs</h1>

      {isLoading ?
        <div className="w-full h-full flex justify-center items-center">
          <div className="spinner size-10 border-5"></div>
        </div>
        :
        <>
          <div className="w-full flex flex-row justify-start gap-3">
            <LogsCategoryButton label="analytics" updateFilters={updateFilters} />
            <LogsCategoryButton label="authentication" updateFilters={updateFilters} />
            <LogsCategoryButton label="user-management" updateFilters={updateFilters} />
            <LogsCategoryButton label="admin-management" updateFilters={updateFilters} />
            <LogsCategoryButton label="medicine-management" updateFilters={updateFilters} />
            <LogsCategoryButton label="schedule-management" updateFilters={updateFilters} />
            <LogsCategoryButton label="error" setIsError={setIsErrorFilterOn} />
          </div>
          <div className="w-full pr-5 self-start">
            {filteredLogs.map((log) => {
              return (<SystemLogCard key={log._id} log={log} />);
            })}
          </div>
        </>
      }
    </div>

  );
}
