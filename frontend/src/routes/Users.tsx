import { createColumnHelper } from "@tanstack/react-table";
import { dummyUsers } from "../dummyData";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import type { UserType } from "../types/user";
import { useState } from "react";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import AddUserModal from "../components/AddUserModal";

// TODO: Priority in order
// add button
// make checkbox work
// apply pagination
// try to apply it to others (admins, medications etc)

export default function UsersRoute() {
  const [users, setUsers] = useState(dummyUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const userColumnHelper = createColumnHelper<UserType>();
  const userColumns = [
    userColumnHelper.accessor("checkbox", {
      header: () => (
        <div className="w-full flex justify-center items-center">
          <input type="checkbox" />
        </div>
      ),
      cell: (_props) => (
        <div className="w-full flex justify-center items-center">
          <input type="checkbox" />
        </div>
      ),
      size: 50,
    }),
    userColumnHelper.accessor("id", {
      header: "id",
      size: 100,
    }),
    userColumnHelper.accessor("email", {
      header: "Email",
      size: 150,
      minSize: 50,
    }),
    userColumnHelper.accessor("username", {
      header: "Username",
      size: 100,
    }),
    userColumnHelper.accessor("firstName", {
      header: "First name",
      size: 100,
    }),
    userColumnHelper.accessor("lastName", {
      header: "Last name",
      size: 100,
    }),
    // userColumnHelper.accessor("password", {
    //   header: "Password",
    //   size: 250,
    // }),
    userColumnHelper.accessor("actions", {
      header: "",
      size: 60,
      minSize: 60,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div>
            <button
              type="button"
              className="p-1.5 mx-1.5 dark:bg-primary-dark/50 rounded-md cursor-pointer"
              onClick={() => {setIsEditModalOpen(true)}}
            >
              <FaEdit size="1.2rem" />
            </button>
            {isEditModalOpen && (
              <EditUserModal key={props.row.id}
                onClose={() => setIsEditModalOpen(false)}
                data={props.row.original}
                setUsers={setUsers}
              />
            )}
            <button
              type="button"
              className="p-1.5 mx-1.5 dark:bg-secondary-dark/50 rounded-md cursor-pointer"
              onClick={() => {setIsDeleteModalOpen(true)}}>
              <FaTrash size="1.2rem" />
            </button>
            {isDeleteModalOpen && (
              <DeleteUserModal 
                onClose={() => setIsDeleteModalOpen(false)}
                data={props.row.original}
                setUsers={setUsers}
              />
            )}
          </div>
        );
      }
    }),
  ];

  return (
    <div className="h-full px-12 pt-12 flex flex-col items-center gap-4">
      <div className="h-10 w-full mb-2 self-start flex items-center">
        <div className="w-6/12">
          <h1 className="self-start text-2xl font-mona font-bold">Users</h1>
        </div>
        <div className="w-6/12 pr-5 flex justify-end">
          <div className="p-1 flex justify-center items-center cursor-pointer
            border dark:border-primary-dark/50 dark:hover:bg-primary-dark/50 dark:text-primary-dark/50 
            dark:hover:text-dark-text rounded-md "
          >
            <button 
              type="button" 
              className="cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            > 
              <FaPlus size="1.2rem" className=""/>
            </button>
            {isAddModalOpen && (
              <AddUserModal 
                onClose={() => setIsAddModalOpen(false)}
                setUsers={setUsers}
              />
            )}
          </div>
        </div>
      </div>
      <Table
        columns={userColumns}
        content={users}
      />
    </div>
  );
}
