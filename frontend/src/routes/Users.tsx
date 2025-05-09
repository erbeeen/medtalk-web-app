import type { AdminUserType, UserType } from "../types/user";
import Table from "../components/AdminTable";
import { createColumnHelper } from "@tanstack/react-table";

export default function UsersRoute() {
  const adminColumnHelpers = createColumnHelper<AdminUserType>();
  const adminColumns = [
    adminColumnHelpers.accessor("id", {
      header: "ID",
    }),
    adminColumnHelpers.accessor("role", {
      header: "Role",
    }),
    adminColumnHelpers.accessor("username", {
      header: "Username",
    }),
    adminColumnHelpers.accessor("firstName", {
      header: "First Name",
    }),
    adminColumnHelpers.accessor("lastName", {
      header: "Last Name",
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


  const userColumnHelper = createColumnHelper<UserType>();
  const userColumns = [
    userColumnHelper.accessor("id", {
      header: () => "ID",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("username", {
      header: () => "Username",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("firstName", {
      header: () => "First Name",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("lastName", {
      header: () => "Last Name",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("email", {
      header: () => "Email",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("password", {
      header: () => "Password",
      footer: info => info.column.id,
    })
  ]

  const dummyUsers: Array<UserType> = [
    {
      id: "123",
      username: "asdf",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail@gmail.com",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
    {
      id: "234",
      username: "sdfg",
      firstName: "Jane",
      lastName: "Doe",
      email: "samplemail2@gmail.com",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
    {
      id: "345",
      username: "dfgh",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail3@gmail.com",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
  ];

  return (
    <div className="px-12 flex flex-col items-center gap-4">
      <div className="h-52 w-full rounded-md p-5 px-7 bg-secondary dark:bg-gray-700/50 text-dark-text">
        <h1>Admin Table</h1>
        <Table
          columns={adminColumns}
          content={dummyAdmins}
        />

      </div>

      <div className="h-52 w-full p-5 px-7 bg-primary/100 dark:bg-gray-700/50 text-light-text dark:text-dark-text rounded-md">
        <h1 className="mb-2">User Table</h1>
        {/* <UserTable /> */}
        <Table
          columns={userColumns}
          content={dummyUsers}
        />
      </div>
    </div>
  );
}
