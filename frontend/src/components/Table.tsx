import type { AccessorKeyColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { useState } from "react";

type TableProps = {
  columns: Array<AccessorKeyColumnDef<any, any>>;
  content: Array<any>;
  columnFilters?: Array<any>;
};

export default function Table({ columns, content, columnFilters }: TableProps) {
  // const [data, _setdata] = useState(content);

  const table = useReactTable({
    data: content,
    columns: columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
  });

  // table.getHeaderGroups().map((headerGroup) => console.log(headerGroup));
  // console.log(table.getRowModel().rows);
  

  return (
    <div className="w-full h-full flex flex-row justify-center items-center">
      <table
        className="w-full text-left border-spacing-0 border border-none rounded-2xl"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-700/70 rounded-xl">
              {headerGroup.headers.map((header) => (
                <th
                  className="py-5 align-middle font-open-sans font-light"
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize
                  }}
                >
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
            <tr key={row.id} className="bg-gray-700/30">
              {row.getVisibleCells().map((cell) => (
                <td className="py-4 font-open-sans font-light align-middle" key={cell.id} id={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}
