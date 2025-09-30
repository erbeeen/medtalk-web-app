import { useState, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import type { UserType } from "../types/user";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import ScrollTableData from "../components/ScrollTableData";
import UserAddModal from "../components/modals/UserAddModal";
import UserDeleteModal from "../components/modals/UserDeleteModal";
import UserEditModal from "../components/modals/UserEditModal";

type UsersRouteProps = {
  scrollToTop: () => void;
}

// FIX: 
// checkbox selects data even outside the page

export default function UsersRoute({ scrollToTop }: UsersRouteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Users | MedTalk";

    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        })

        if (response.status == 401) {
          setTimeout(async () => {
            await fetchData();
          }, 1000);
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        console.error("loading medicine data failed: ", err);
      }
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchData();
        setIsLoading(false);
      } catch (err) {
        console.error("error fetching data: ", err);
        alert(`error fetching data: ${err}`);
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const userColumnHelper = createColumnHelper<UserType>();
  const userColumns = [
    userColumnHelper.accessor("status", {
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
    // userColumnHelper.accessor("_id", {
    //   header: "_id",
    //   cell: props => <ScrollTableData props={props} value={String(props.getValue())} />,
    //   size: 100,
    //   minSize: 100,
    // }),
    userColumnHelper.accessor("username", {
      header: "Username",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    userColumnHelper.accessor("email", {
      header: "Email",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
      minSize: 200,
    }),
    userColumnHelper.accessor("firstName", {
      header: "First name",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    userColumnHelper.accessor("lastName", {
      header: "Last name",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    userColumnHelper.accessor("verified", {
      header: "Verified",
      // cell: props => <ScrollTableData props={props} />,
      cell: props => <ScrollTableData props={props} value={String(props.getValue())} />,
      enableGlobalFilter: false,
      size: 75,
      // minSize: 150,
    }),
    userColumnHelper.accessor("actions", {
      header: "",
      size: 100,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div className="text-center">
            <button
              type="button"
              className="p-1.5 mx-1 border bg-edit hover:bg-edit/70 border-edit text-black rounded-md cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}>
              <FaEdit />
            </button>
            {isEditModalOpen && (
              <UserEditModal key={props.row.id}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setUsers={setUsers} />
            )}
            <button
              type="button"
              className="p-1.5 mx-1 text-white bg-delete hover:bg-delete/70 border border-delete rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash />
            </button>
            {isDeleteModalOpen && (
              <UserDeleteModal
                onClose={() => {
                  setIsDeleteModalOpen(false);
                  setIsDeleteAllModalOpen(false);
                }}
                data={props.row.original}
                setUsers={setUsers} />
            )}
          </div>
        );
      }
    }),
  ];

  return (
    <>
      <div className="base-layout flex flex-col items-center gap-4">

        <div className="self-start">
          <h1 className="text-2xl font-bold">User Management</h1>
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

          <div className="w-2/12 flex justify-end gap-2">
            <div className="px-2 py-1.5 flex justify-center flex-nowrap items-center 
            cursor-pointer rounded-md bg-primary hover:bg-primary/80 text-white"

              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size="1.2rem" className="text-current" />
            </div>
            {isAddModalOpen && (
              <UserAddModal
                onClose={() => setIsAddModalOpen(false)}
                setUsers={setUsers}
              />
            )}
            <div>
              {Object.keys(rowSelection).length != 0 && (
                <button
                  type="button"
                  className="p-2 rounded-md text-white bg-delete hover:bg-delete/70 cursor-pointer"
                  onClick={() => setIsDeleteAllModalOpen(true)}>
                  <FaTrash size="1.2rem" />
                </button>
              )}
              {isDeleteAllModalOpen && (
                <UserDeleteModal
                  onClose={() => {
                    setIsDeleteAllModalOpen(false);
                    setRowSelection({});
                  }}
                  data={rowSelection}
                  setUsers={setUsers} />
              )}
            </div>
          </div>

        </div>
        {isLoading ?
          <div className="spinner size-10 border-5"></div>
          :
          <Table
            columns={userColumns}
            content={users}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            scrollToTop={scrollToTop}
          />
        }
      </div>

    </>
  );
}
