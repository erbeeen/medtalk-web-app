import type { UserType } from "../types/user";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";

export default function UsersRoute() {
  const userColumnHelper = createColumnHelper<UserType>();
  const userColumns = [
    userColumnHelper.accessor("id", {
      header: () => "id",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("email", {
      header: () => "email",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("username", {
      header: () => "username",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("firstName", {
      header: () => "first name",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("lastName", {
      header: () => "last name",
      footer: info => info.column.id,
    }),
    userColumnHelper.accessor("password", {
      header: () => "password",
      footer: info => info.column.id,
    })
  ]

  const dummyUsers: Array<UserType> = [
    {
      id: "123",
      email: "samplemail@gmail.com",
      username: "asdf",
      firstName: "John",
      lastName: "Doe",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
    {
      id: "234",
      email: "samplemail2@gmail.com",
      username: "sdfg",
      firstName: "Jane",
      lastName: "Doe",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
    {
      id: "345",
      email: "samplemail3@gmail.com",
      username: "dfgh",
      firstName: "John",
      lastName: "Doe",
      password: "a;sdlkfjweporuwe;l;({[`$&*({[`@);elkr",
    },
  ];

  return (
    <div className="h-full px-12 pt-12 flex flex-col items-center gap-4">
       {/* <div className="w-full p-5 px-7 bg-primary/100 dark:bg-gray-700/50 text-light-text dark:text-dark-text rounded-md"> */}
      <div className="self-start pl-6 text-lg">
        <h1>Users</h1>
      </div>
        {/* <UserTable /> */}
        <Table
          columns={userColumns}
          content={dummyUsers}
        />
      {/* </div> */}
    </div>
  );
}
