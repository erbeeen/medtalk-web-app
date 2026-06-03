import { useState, useEffect } from "react";
import LogsCategoryButton from "../components/buttons/LogsCategoryButton";
import { type SystemLogType } from "../types/systemlogs";
import SystemLogCard from "../components/SystemLogCard";

type FilterType = {
  label: string;
  value: string;
  errorFilterOn?: boolean;
}

const LogFilters: Array<FilterType> = [
  {
    label: "Analytics",
    value: "analytics",
  },
  {
    label: "Authentication",
    value: "authentication",
  },
  {
    label: "User Management",
    value: "user-management",
  },
  {
    label: "Admin Management",
    value: "admin-management",
  },
  {
    label: "Medicine Management",
    value: "medicine-management",
  },
  {
    label: "Schedule Management",
    value: "schedule-management",
  },
  {
    label: "Error",
    value: "error",
    errorFilterOn: true,
  }
]

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
  }, [filters, isErrorFilterOn]);



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
          <div className="flex w-full flex-col justify-start gap-3">
            <div className="w-full flex flex-row justify-start items-center gap-3">
              <span className="text-sm">Filter by:</span>
              {LogFilters.map((filter) => (
                <LogsCategoryButton
                  label={filter.label}
                  value={filter.value}
                  updateFilters={filter.errorFilterOn ? undefined : updateFilters}
                  setIsErrorFilterOn={filter.errorFilterOn ? setIsErrorFilterOn : undefined}
                />
              ))}
            </div>
            <div className="w-full pr-5 self-start">
            </div>
            {filteredLogs.map((log) => {
              return (<SystemLogCard key={log._id} log={log} />);
            })}
          </div>
        </>
      }
    </div>

  );
}
