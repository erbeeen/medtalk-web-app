import { useState, useEffect } from "react";
// import type { ScheduleType } from "../types/schedule";
import { FaPlus } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import ScrollTableData from "../components/ScrollTableData";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import ScheduleAddModal from "../components/modals/ScheduleAddModal";
// import ScheduleEditModal from "../components/modals/ScheduleEditModal";
// import ScheduleDeleteModal from "../components/modals/ScheduleDeleteModal";
import { type UserType } from "../types/user";
import Select from "react-select";
import type { FormattedSchedule } from "../types/formatted-schedule";
import { useUser } from "../contexts/UserContext";

type ScheduleRouteProps = {
  scrollToTop: () => void;
}

type SelectOption = {
  value: string | undefined;
  label: string;
  user: UserType;
};

export default function ScheduleRoute({ scrollToTop }: ScheduleRouteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [schedules, setSchedules] = useState<Array<FormattedSchedule>>([]);
  const [rowSelection, setRowSelection] = useState({});
  // const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState<UserType>();
  const { user } = useUser();


  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState<Array<SelectOption>>([]);
  const [selectedUser, setSelectedUser] = useState<SelectOption | null>(null);

  const handlePatientChange = (option: SelectOption | null) => {
    setSelectedUser(option);
  }

  useEffect(() => {
    document.title = "Schedules | MedTalk";

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("error fetching users: ", error);
      }
    }

    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`/api/users/?id=${user?.id}`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        const data = result.data;
        setDoctorDetails(data);
      } catch (err) {
        console.error("error fetching doctor details: ", err);
      }
    }
    const loadData = async () => {
      setIsLoading(true);
      await fetchUsers();
      await fetchDoctorDetails();
      setIsLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    const options: Array<SelectOption> = users.map((user: UserType) => {
      return {
        value: user._id,
        label: `${user.firstName} ${user.lastName} (${user.username})`,
        user: user
      };
    });
    setUserOptions(options);
  }, [users]);

  useEffect(() => {
    if (selectedUser === null)
      return;

    const fetchSchedules = async () => {
      try {
        setIsTableLoading(true);

        const response = await fetch(`/api/schedule/format/?id=${selectedUser.user._id}`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });

        const content = await response.json();
        setSchedules(content.data)
      } catch (error) {
        console.error("Error getting user's schedule: ", error);
      } finally {
        setIsTableLoading(false);
      }
    }

    fetchSchedules();
  }, [selectedUser])

  const scheduleColumnHelper = createColumnHelper<FormattedSchedule>();
  const scheduleColumns = [
    scheduleColumnHelper.accessor("medicineName", {
      header: "Medicine",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("measurement", {
      header: "Measurement",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("startDate", {
      header: "Start Date",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
      minSize: 100,
    }),
    scheduleColumnHelper.accessor("endDate", {
      header: "End Date",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    scheduleColumnHelper.accessor("intakeTimes", {
      header: "Intake Times",
      cell: props => <ScrollTableData props={props} />,
      size: 150,
    }),
    scheduleColumnHelper.accessor("assignedBy", {
      header: "Assigned By",
      cell: props => <ScrollTableData props={props} />,
      size: 150,
    })
  ]

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
      </div>

      {isLoading ?
        <div className="w-full h-full flex justify-center items-center">
          <div className="spinner size-10 border-5"></div>
        </div>
        :
        <>
          <div className="self-start w-full flex flex-row justify-between items-center">
            <Select<SelectOption>
              options={userOptions}
              value={selectedUser}
              onChange={handlePatientChange}
              placeholder="Search by name"
              className="self-start w-3/12 dark:text-black"
            />

            <div className={`self-end px-2 py-1.5 flex justify-center flex-nowrap items-center 
            cursor-pointer rounded-md bg-primary hover:bg-primary/80 text-white ${!selectedUser ? "hidden" : ""}`}
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size="1.2rem" />
            </div>
            {isAddModalOpen && (
              <ScheduleAddModal
                onClose={() => setIsAddModalOpen(false)}
                setSchedules={setSchedules}
                userID={selectedUser?.user._id}
                doctorName={`${doctorDetails?.firstName} ${doctorDetails?.lastName}`}
              />
            )}
          </div>
          {selectedUser && (
            <>
              {isTableLoading ?
                <div className="spinner size-10 border-5"></div>
                :
                <>
                  {schedules.length > 0 ?
                    <Table
                      columns={scheduleColumns}
                      content={schedules}
                      rowSelection={rowSelection}
                      onRowSelectionChange={setRowSelection}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      scrollToTop={scrollToTop}
                    />
                    :
                    <div className="mt-40">No records available.</div>
                  }
                </>
              }
            </>
          )}
        </>
      }
    </div>
  );
}

