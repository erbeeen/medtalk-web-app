import { useState, useEffect } from "react";
import type { ScheduleType } from "../types/schedule";
import { useNavigate } from "react-router-dom";
import automaticLogin from "../auth/auth";
import { createColumnHelper } from "@tanstack/react-table";
import ScrollTableData from "../components/ScrollTableData";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import ScheduleAddModal from "../components/modals/ScheduleAddModal";
import ScheduleEditModal from "../components/modals/ScheduleEditModal";
import ScheduleDeleteModal from "../components/modals/ScheduleDeleteModal";

type ScheduleRouteProps = {
  scrollToTop: () => void;
}

export default function ScheduleRoute({ scrollToTop }: ScheduleRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<Array<ScheduleType>>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Schedules | MedTalk";

    const loadData = async () => {
      try {
        const response = await fetch("/api/schedule/all", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        })

        const data = await response.json();
        console.log(data.data);
        setSchedules(data.data);
      } catch (err) {
        console.error("loading schedule data failed: ", err);
      }
    }

    setIsLoading(true);
    const loginAndLoadData = async () => {
      try {
        await automaticLogin(navigate, "/schedules");
        await loadData();
      } catch (err) {
        console.error("login failed: ", err);
      } finally {
        setIsLoading(false);
      }
    }


    loginAndLoadData();
    setIsLoading(false);
  }, []);

  const scheduleColumnHelper = createColumnHelper<ScheduleType>();
  const scheduleColumns = [
    scheduleColumnHelper.accessor("status", {
      header: (props) => (
        <div className="w-full flex justify-center items-center">
          <input
            type="checkbox"
            checked={props.table.getIsAllRowsSelected()}
            onChange={props.table.getToggleAllRowsSelectedHandler()} />
        </div>
      ),
      cell: (props) => (
        <div className="w-full flex justify-center items-center">
          <input
            type="checkbox"
            checked={props.row.getIsSelected()}
            onChange={props.row.getToggleSelectedHandler()} />
        </div>
      ),
      size: 50,
      minSize: 50,
    }),
    scheduleColumnHelper.accessor("_id", {
      header: "_id",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("userID", {
      header: "User ID",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
      minSize: 100,
    }),
    scheduleColumnHelper.accessor("medicineName", {
      header: "Medicine Name",
      cell: props => <ScrollTableData props={props} />,
      size: 200,
    }),
    scheduleColumnHelper.accessor("measurement", {
      header: "Measurement",
      cell: props => <ScrollTableData props={props} />,
      size: 150,
    }),
    scheduleColumnHelper.accessor("intakeInstruction", {
      header: "Intake Instruction",
      cell: props => <ScrollTableData props={props} />,
      size: 200,
    }),
    scheduleColumnHelper.accessor("isTaken", {
      header: "Is Taken",
      cell: props => <ScrollTableData props={props} value={String(props.getValue())} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("date", {
      header: "date",
      cell: props => <ScrollTableData props={props} value={String(props.getValue())} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("actions", {
      header: "",
      size: 125,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div className="text-center">
            <button
              type="button"
              className="p-1.5 mx-1.5 border border-edit-dark/70 dark:hover:bg-edit-dark/70 
              dark:text-edit-dark dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}>
              <FaEdit size="1.2rem" />
            </button>
            {isEditModalOpen && (
              <ScheduleEditModal 
                key={props.row.id}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setSchedules={setSchedules} />
            )}
            <button
              type="button"
              className="p-1.5 mx-1.5 border dark:border-delete-dark/50 dark:hover:bg-delete-dark/50 
              dark:text-delete-dark/50 dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash size="1.2rem" />
            </button>
            {isDeleteModalOpen && (
              <ScheduleDeleteModal
                onClose={() => {
                  setIsDeleteModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setSchedules={setSchedules} />
            )}
          </div>
        );
      }
    }),
  ]

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
      </div>

      <div className="h-10 w-full mb-2 self-start flex items-center gap-5">
        <div className="w-10/12">
          <SearchBar
            onChange={(value: string) => setSearchText(value)}
            searchFn={() => setGlobalFilter(searchText)}
            clearFn={() => {
              setSearchText("");
              setGlobalFilter([]);
            }}
            value={searchText}
          />
        </div>

        <div className="w-2/12 flex justify-end gap-3">
          <div className="p-2 flex justify-center flex-nowrap items-center cursor-pointer
            border dark:border-primary-dark/60 dark:hover:bg-primary-dark/80 
            dark:text-primary-dark/60 dark:hover:text-dark-text rounded-md "
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus size="1.3rem" />
          </div>
          {isAddModalOpen && (
            <ScheduleAddModal
              onClose={() => setIsAddModalOpen(false)}
              setSchedules={setSchedules}
            />
          )}
          <div>
            {Object.keys(rowSelection).length != 0 && (
              <button
                type="button"
                className="p-2 border rounded-md dark:border-delete-dark/50 
                dark:hover:bg-delete-dark/50 dark:text-delete-dark/50 
                dark:hover:text-dark-text cursor-pointer"
                onClick={() => setIsDeleteAllModalOpen(true)}>
                <FaTrash size="1.3rem" />
              </button>
            )}
            {isDeleteAllModalOpen && (
              <ScheduleDeleteModal
                onClose={() => setIsDeleteAllModalOpen(false)}
                data={rowSelection}
                setSchedules={setSchedules} 
              />
            )}
          </div>
        </div>

      </div>
      {!isLoading &&
        <Table
          columns={scheduleColumns}
          content={schedules}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          scrollToTop={scrollToTop}
        />
      }
    </div>
  );
}
