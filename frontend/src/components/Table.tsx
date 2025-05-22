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
    <div className="w-full h-full border border-dark/10 dark:border-light/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse border-spacing-0">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-700/40 border-b border-dark/10 dark:border-light/10 rounded-2xl ">
              {headerGroup.headers.map((header) => (
                <th
                  className="py-5 align-middle font-mona font-medium "
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
            // <tr key={row.id} className="bg-gray-700/30">
            <tr key={row.id} className="border-b border-dark/10 dark:border-light/10">
              {row.getVisibleCells().map((cell) => (
                <td className="py-4 font-mona font-light align-middle" key={cell.id} id={cell.id}>
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
