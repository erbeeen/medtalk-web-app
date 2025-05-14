import type { AdminUserType } from "../types/user";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";

export default function AdminsRoute() {
  const adminColumnHelpers = createColumnHelper<AdminUserType>();
  const adminColumns = [
    adminColumnHelpers.accessor("id", {
      header: "id",
    }),
    adminColumnHelpers.accessor("role", {
      header: "Role",
    }),
    adminColumnHelpers.accessor("username", {
      header: "Username",
    }),
    adminColumnHelpers.accessor("firstName", {
      header: "First name",
    }),
    adminColumnHelpers.accessor("lastName", {
      header: "Last name",
    }),
    adminColumnHelpers.accessor("email", {
      header: "Email",
    }),
  ];

  const dummyAdmins: Array<AdminUserType> = [
    {
      id: "123",
      role: "super admin",
      username: "asdf",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail@gmail.com",
    },
    {
      id: "234",
      role: "admin",
      username: "sdfg",
      firstName: "Jane",
      lastName: "Doe",
      email: "samplemail2@gmail.com",
    },
    {
      id: "345",
      role: "super admin",
      username: "dfgh",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail3@gmail.com",
    },
  ];


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
