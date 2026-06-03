import { useState, useEffect, useMemo } from "react";
import { type SystemLogType } from "../types/systemlogs";
import SystemLogCard from "../components/SystemLogCard";
import Pagination from "../components/Pagination";

type FilterType = {
  label: string;
  value: string;
}

type PaginationParams = {
  page: number;
  limit: number;
}

const LogFilters: Array<FilterType> = [
  {
    label: "All",
    value: "",
  },
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
];

const StatusFilters: Array<FilterType> = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Info",
    value: "info",
  },
  {
    label: "Error",
    value: "error"
  },
];

export default function SystemLogsRoute() {
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 50
  });
  const { page, limit } = paginationParams;
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<Array<SystemLogType>>([]);
  const [filter, setFilter] = useState<String>("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    console.log("logs length:", logs.length);
  }, [logs]);

  const handlePageChange = (newPage: number) => {
    setPaginationParams((prev: PaginationParams) => ({ ...prev, page: newPage }));
  }

  const filteredLogs = useMemo(() => {
    let filteredLogs = logs;

    if (filter) {
      filteredLogs = filteredLogs.filter((log) => log.category === filter)
    }

    if (statusFilter) {
      filteredLogs = filteredLogs.filter((log) => log.level === statusFilter);
    }

    return filteredLogs;
  }, [logs, filter, statusFilter]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, page]);

  console.log("paginated logs length:", paginatedLogs.length);
  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    setPaginationParams((prev) => ({ ...prev, page: 1 }));
  }

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPaginationParams((prev) => ({ ...prev, page: 1 }));
  }

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
          <div className="flex min-h-0 flex-1 w-full flex-col justify-start gap-3">
            <section className="w-full flex flex-col md:flex-row justify-start items-start md:items-center gap-3">
              <div className="space-x-3">
                <span className="text-sm">Category:</span>
                <select
                  name="category-filter"
                  id="category-filter"
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="p-1 pr-3 border rounded-md text-sm bg-gray-200 text-light-text"
                >
                  {LogFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-x-3">
                <span className="text-sm">Status:</span>
                <select
                  name="status-filter"
                  id="status-filter"
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="p-1 pr-3 border rounded-md text-sm bg-gray-200 text-light-text"
                >
                  {StatusFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>
            </section>

            <hr className="w-full mx-auto my-2 text-gray-300" />

            <section className="flex flex-1 min-h-0 w-full self-start flex-col">
              {paginatedLogs.length <= 0 ? (
                <div className="flex mt-5 justify-center">
                  <span>No records available.</span>
                </div>
              ) : (
                <div className="w-full flex-1 overflow-y-auto">
                  {paginatedLogs.map((log) => (
                    <SystemLogCard key={log._id} log={log} />
                  ))}
                </div>
              )

              }
            </section>

            <hr className="w-full mx-auto my-2 text-gray-300" />

            <section className="w-full">
              <Pagination
                page={page}
                limit={limit}
                total={filteredLogs.length}
                onPageChange={handlePageChange}
              />
            </section>
          </div>
        </>
      }
    </div>

  );
}
