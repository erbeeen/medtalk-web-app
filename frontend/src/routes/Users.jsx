import Table from "../components/Table";

export default function UsersRoute() {
  const adminColumns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
    },
  ];

  const dummyAdmins = [
    {
      id: "123",
      username: "asdf",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail@gmail.com",
      role: "admin",
    },
    {
      id: "234",
      username: "sdfg",
      firstName: "Jane",
      lastName: "Doe",
      email: "samplemail2@gmail.com",
      role: "super admin",
    },
    {
      id: "345",
      username: "dfgh",
      firstName: "John",
      lastName: "Doe",
      email: "samplemail3@gmail.com",
      role: "admin",
    }
  ];

  const userColumns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Password",
      accessor: "password",
    },
  ];

  const dummyUsers = [
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
    <>
      <div className="h-52 w-full p-5 px-7 bg-primary/100 dark:bg-primary-dark/5 text-light-text dark:text-dark-text rounded-md">
        <h1 className="mb-2">Admin Table</h1>
        <Table
          columns={adminColumns}
          contents={dummyAdmins}
        />
      </div>

      <div className="h-52 w-full rounded-md p-5 px-7 bg-secondary dark:bg-secondary/30 text-dark-text">
        <h1>User Table</h1>
        <Table
          columns={userColumns}
          contents={dummyUsers}
        />
      </div>
    </>
  );
}
