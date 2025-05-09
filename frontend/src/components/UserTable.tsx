import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { UserType } from "../types/user";

export default function UserTable() {

  const columnHelper = createColumnHelper<UserType>();
  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      footer: info => info.column.id,
    }),
    columnHelper.accessor("username", {
      header: () => "Username",
      footer: info => info.column.id,
    }),
    columnHelper.accessor("firstName", {
      header: () => "First Name",
      footer: info => info.column.id,
    }),
    columnHelper.accessor("lastName", {
      header: () => "Last Name",
      footer: info => info.column.id,
    }),
    columnHelper.accessor("email", {
      header: () => "Email",
      footer: info => info.column.id,
    }),
    columnHelper.accessor("password", {
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

  const cachedData = useMemo(() => dummyUsers, []);
  // const rerender = useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data: cachedData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td id={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )

}
