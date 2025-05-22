import { createColumnHelper } from "@tanstack/react-table";
import { dummyUsers } from "../dummyData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import type { UserType } from "../types/user";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";

// TODO: Priority in order
// make checkbox work
// apply pagination
// try to apply it to others (admins, medications etc)

export default function UsersRoute() {
  const [users, setUsers] = useState(dummyUsers);

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
      size: 200,
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
              <FaTrashAlt size="1.2rem" />
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

  useEffect(() => {
    console.log("Users updated: ", users);
  }, [users]);

  return (
    <div className="h-full px-12 pt-12 flex flex-col items-center gap-4">
      {/* <div className="w-full p-5 px-7 bg-primary/100 dark:bg-gray-700/50 text-light-text dark:text-dark-text rounded-md"> */}
      <div className="self-start mb-2 text-2xl font-bold">
        <h1>Users</h1>
      </div>
      <Table
        columns={userColumns}
        content={users}
      />
      {/* </div> */}
    </div>
  );
}
