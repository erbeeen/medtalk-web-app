import type { AdminUserType } from "../types/user";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { dummyAdmins } from "../dummyData";

export default function AdminsRoute() {
  const adminColumnHelper = createColumnHelper<AdminUserType>();
  const adminColumns = [
    adminColumnHelper.accessor("status", {
      header: () => <input type="checkbox" />,
      cell: (_props) => (
        <input type="checkbox" />
      ),
      size: 50,
    }),
    adminColumnHelper.accessor("id", {
      header: "id",
      size: 100,
    }),
    adminColumnHelper.accessor("role", {
      header: "Role",
      size: 100,
    }),
    adminColumnHelper.accessor("username", {
      header: "Username",
      size: 100,
    }),
    adminColumnHelper.accessor("firstName", {
      header: "First name",
      size: 100,
    }),
    adminColumnHelper.accessor("lastName", {
      header: "Last name",
      size: 100,
    }),
    adminColumnHelper.accessor("email", {
      header: "Email",
      size: 200,
    }),
    adminColumnHelper.accessor("actions", {
      header: "Actions",
      cell: (props) => (
        <div>
          <button
            className="p-1.5 mx-1.5 dark:bg-primary-dark/50 rounded-md"
            onClick={(_e) => handleEdit(props.row.id)}
          >
            <FaEdit size="1.2rem"/>
          </button>
          <button
            className="p-1.5 mx-1.5 dark:bg-secondary-dark/50 rounded-md"
            onClick={(_e) => handleDelete(props.row.id)}>
            <FaTrashAlt size="1.2rem"/>
          </button>
        </div>
      )
    }),
  ];

  function handleEdit(_id: string) {
    console.log("handle edit");
    
  }

  function handleDelete (_id: string) {
    console.log("handle delete");
    
  }

  return (
    <div className="h-full px-12 pt-12 flex flex-col items-center gap-4">
      {/* <div className="w-full rounded-md p-5 px-7 bg-secondary dark:bg-gray-700/40 text-dark-text"> */}
      <div className="self-start pl-8 text-lg">
        <h1>Admins</h1>
      </div>
        <Table
          columns={adminColumns}
          content={dummyAdmins}
        />
      {/* </div> */}
    </div>
  )
}
