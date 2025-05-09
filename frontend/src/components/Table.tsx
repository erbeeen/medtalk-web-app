import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { AccessorKeyColumnDef } from "@tanstack/react-table";
// import type { }

type TableProp = {
  columns: Array<AccessorKeyColumnDef<any, any>>;
  content: Array<any>;
};

export default function AdminTable({ columns, content }: TableProp) {

  // const columnHelper = createColumnHelper<UserType>();
  // const columns = [
  //   columnHelper.accessor("id", {
  //     header: () => "ID",
  //     footer: info => info.column.id,
  //   }),
  //   columnHelper.accessor("username", {
  //     header: () => "Username",
  //     footer: info => info.column.id,
  //   }),
  //   columnHelper.accessor("firstName", {
  //     header: () => "First Name",
  //     footer: info => info.column.id,
  //   }),
  //   columnHelper.accessor("lastName", {
  //     header: () => "Last Name",
  //     footer: info => info.column.id,
  //   }),
  //   columnHelper.accessor("email", {
  //     header: () => "Email",
  //     footer: info => info.column.id,
  //   }),
  //   columnHelper.accessor("password", {
  //     header: () => "Password",
  //     footer: info => info.column.id,
  //   })
  // ]


  const cachedData = useMemo(() => content, []);
  // const rerender = useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data: cachedData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="w-full text-left">
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
        {/* <tfoot> */}
        {/*   {table.getFooterGroups().map((footerGroup) => ( */}
        {/*     <tr key={footerGroup.id}> */}
        {/*       {footerGroup.headers.map((header) => ( */}
        {/*         <th key={header.id}> */}
        {/*           {header.isPlaceholder */}
        {/*             ? null */}
        {/*             : flexRender( */}
        {/*               header.column.columnDef.footer, */}
        {/*               header.getContext() */}
        {/*             )} */}
        {/*         </th> */}
        {/*       ))} */}
        {/*     </tr> */}
        {/*   ))} */}
        {/* </tfoot> */}
      </table>
    </div>
  )

}
