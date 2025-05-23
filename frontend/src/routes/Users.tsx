import { useState, useRef, type RefObject } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { dummyUsers } from "../dummyData";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import type { UserType } from "../types/user";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import AddUserModal from "../components/AddUserModal";

// TODO: Priority in order
// apply pagination
// search (?)
// try to apply it to others (admins, medications etc)
// styling
// animations

// TODO: Maybe include password as a column but not 
// editable in edit modal??

// FIX: 
// checkbox selects data even outside the page
// mobile responsiveness of the table

type UsersRouteProps = {
  scrollToTop: () => void;
}

export default function UsersRoute({ scrollToTop }: UsersRouteProps) {
  const [users, setUsers] = useState(dummyUsers);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

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
    }),
    userColumnHelper.accessor("_id", {
      header: "id",
      // size: 100,
    }),
    userColumnHelper.accessor("email", {
      header: "Email",
      // minSize: 150,
      // size: 150,
    }),
    userColumnHelper.accessor("username", {
      header: "Username",
      // size: 100,
    }),
    userColumnHelper.accessor("firstName", {
      header: "First name",
      // size: 100,
    }),
    userColumnHelper.accessor("lastName", {
      header: "Last name",
      // size: 100,
    }),
    userColumnHelper.accessor("password", {
      header: "Password",
      enableGlobalFilter: false,
      // size: 250,
    }),
    userColumnHelper.accessor("actions", {
      header: "",
      // size: 60,
      // minSize: 60,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div>
            <button
              type="button"
              className="p-1.5 mx-1.5 border border-edit-dark/70 dark:hover:bg-edit-dark/70 
              dark:text-edit-dark dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}>
              <FaEdit size="1.2rem" />
            </button>
            {isEditModalOpen && (
              <EditUserModal key={props.row.id}
                onClose={() => setIsEditModalOpen(false)}
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
              <DeleteUserModal
                onClose={() => setIsDeleteModalOpen(false)}
                data={props.row.original}
                setUsers={setUsers} />
            )}
          </div>
        );
      }
    }),
  ];

  return (
    <div className="px-12 pt-12 flex flex-col items-center gap-4">
      <div className="h-10 w-full mb-2 self-start flex items-center">

        <div className="w-4/12">
          <h1 className="self-start text-2xl font-bold">User Management</h1>
        </div>

        {/* TODO: Add styling */}
        <div className="w-4/12">
          <input
            className="w-full bg-white text-black"
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setGlobalFilter(e.target.value);
            }}
          />
        </div>

        <div className="w-4/12 pr-5 flex justify-end gap-3">
          <div className="p-2 flex justify-center flex-nowrap items-center cursor-pointer
            border dark:border-primary-dark/50 dark:hover:bg-primary-dark/50 
            dark:text-primary-dark/50 dark:hover:text-dark-text rounded-md ">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}>
              <FaPlus size="1.3rem"/>
            </button>
            {isAddModalOpen && (
              <AddUserModal
                onClose={() => setIsAddModalOpen(false)}
                setUsers={setUsers} 
              />
            )}
          </div>
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
              <DeleteUserModal
                onClose={() => setIsDeleteAllModalOpen(false)}
                data={rowSelection}
                setUsers={setUsers} />
            )}
          </div>
        </div>

      </div>
      <Table
        columns={userColumns}
        content={users}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        scrollToTop={scrollToTop}
      />
    </div>
  );
}
