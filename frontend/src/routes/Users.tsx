import UserTable from "../components/UserTable";

export default function UsersRoute() {
  return (
    <div className="px-12 flex flex-col items-center gap-4">
      <div className="h-52 w-full p-5 px-7 bg-primary/100 dark:bg-gray-700/50 text-light-text dark:text-dark-text rounded-md">
        <h1 className="mb-2">Admin Table</h1>
        <UserTable />
      </div>

      <div className="h-52 w-full rounded-md p-5 px-7 bg-secondary dark:bg-gray-700/50 text-dark-text">
        <h1>User Table</h1>
        {/* <Table */}
        {/*   columns={userColumns} */}
        {/*   contents={dummyUsers} */}
        {/* /> */}
      </div>
    </div>
  );
}
