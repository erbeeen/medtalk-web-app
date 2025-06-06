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
import { useNavigate } from "react-router-dom";
import automaticLogin from "../auth/auth";

type UsersRouteProps = {
  scrollToTop: () => void;
}

// TODO: Priority in order
// try to apply it to others (admins, medications etc)
// animations:
//  delete button appearing
//  add, edit, delete modals appearing 

// FIX: 
// checkbox selects data even outside the page

export default function UsersRoute({ scrollToTop }: UsersRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Users | MedTalk";

    const loadData = async () => {
      try {
        const response = await fetch("/api/users/", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        })

        const data = await response.json();
        console.log(data.data);
        setUsers(data.data);
      } catch (err) {
        console.error("loading medicine data failed: ", err);
      }
    }

    setIsLoading(true);
    const loginAndLoadData = async () => {
      try {
        await automaticLogin(navigate, "/users");
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
    userColumnHelper.accessor("_id", {
      header: "_id",
      cell: props => <ScrollTableData props={props} value={String(props.getValue())} />,
      size: 100,
      minSize: 100,
    }),
    userColumnHelper.accessor("email", {
      header: "Email",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
      minSize: 200,
    }),
    userColumnHelper.accessor("username", {
      header: "Username",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
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
    // userColumnHelper.accessor("password", {
    //   header: "Password",
    //   cell: props => <ScrollTableData props={props} />,
    //   enableGlobalFilter: false,
    //   size: 200,
    //   minSize: 150,
    // }),
    userColumnHelper.accessor("actions", {
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
              className="p-1.5 mx-1.5 border dark:border-delete-dark/50 dark:hover:bg-delete-dark/50 
              dark:text-delete-dark/50 dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash size="1.2rem" />
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

        <div className="w-2/12 flex justify-end gap-3">
          <div className="p-2 flex justify-center flex-nowrap items-center cursor-pointer
            border dark:border-primary-dark/60 dark:hover:bg-primary-dark/80 
            dark:text-primary-dark/60 dark:hover:text-dark-text rounded-md "
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus size="1.3rem" />
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
                className="p-2 border rounded-md dark:border-delete-dark/50 
                dark:hover:bg-delete-dark/50 dark:text-delete-dark/50 
                dark:hover:text-dark-text cursor-pointer"
                onClick={() => setIsDeleteAllModalOpen(true)}>
                <FaTrash size="1.3rem" />
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
      {!isLoading &&
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
  );
}
