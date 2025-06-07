import { useState, useEffect } from "react";
import type { AdminUserType } from "../types/user";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import { createColumnHelper } from "@tanstack/react-table";
import AdminAddModal from "../components/modals/AdminAddModal";
import AdminDeleteModal from "../components/modals/AdminDeleteModal";
import ScrollTableData from "../components/ScrollTableData";
import AdminEditModal from "../components/modals/AdminEditModal";
import { useNavigate } from "react-router-dom";
import automaticLogin from "../auth/auth";

type AdminsRouteProps = {
  scrollToTop: () => void;
}

// TODO: Priority in order
// try to apply it to others (admins, medications etc)
// animations:
//  delete button appearing
//  add, edit, delete modals appearing

// FIX: 
// checkbox selects data even outside the page

export default function AdminsRoute({ scrollToTop }: AdminsRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Array<AdminUserType>>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Admins | MedTalk"

    const loadData = async () => {
      try {
        const response = await fetch("/api/users/admins", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        })

        const data = await response.json();
        console.log(data.data);
        setAdmins(data.data);
      } catch (err) {
        console.error("loading medicine data failed: ", err);
      }
    }

    setIsLoading(true);
    const loginAndLoadData = async () => {
      try {
        await automaticLogin(navigate, "/admins");
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

  const adminColumnHelper = createColumnHelper<AdminUserType>();
  const adminColumns = [
    adminColumnHelper.accessor("status", {
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
    adminColumnHelper.accessor("_id", {
      header: "_id",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    adminColumnHelper.accessor("role", {
      header: "Role",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
      minSize: 100,
    }),
    adminColumnHelper.accessor("email", {
      header: "Email",
      cell: props => <ScrollTableData props={props} />,
      size: 200,
    }),
    adminColumnHelper.accessor("username", {
      header: "Username",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    adminColumnHelper.accessor("firstName", {
      header: "First name",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    adminColumnHelper.accessor("lastName", {
      header: "Last name",
      cell: props => <ScrollTableData props={props} />,
      size: 100,
    }),
    adminColumnHelper.accessor("actions", {
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
              <AdminEditModal key={props.row.id}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setAdmins={setAdmins} />
            )}
            <button
              type="button"
              className="p-1.5 mx-1.5 border dark:border-delete-dark/50 dark:hover:bg-delete-dark/50 
              dark:text-delete-dark/50 dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash size="1.2rem" />
            </button>
            {isDeleteModalOpen && (
              <AdminDeleteModal
                onClose={() => {
                  setIsDeleteModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setAdmins={setAdmins} />
            )}
          </div>
        );
      }
    }),
  ];

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Admin Management</h1>
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
            <AdminAddModal
              onClose={() => setIsAddModalOpen(false)}
              setAdmins={setAdmins}
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
              <AdminDeleteModal
                onClose={() => {
                  setIsDeleteAllModalOpen(false);
                  setRowSelection({});
                }}
                data={rowSelection}
                setAdmins={setAdmins} />
            )}
          </div>
        </div>

      </div>
      {!isLoading &&
        <Table
          columns={adminColumns}
          content={admins}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          scrollToTop={scrollToTop}
        />
      }
    </div>
  )
}
