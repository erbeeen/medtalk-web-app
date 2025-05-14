import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { AccessorKeyColumnDef } from "@tanstack/react-table";

type TableProp = {
  columns: Array<AccessorKeyColumnDef<any, any>>;
  content: Array<any>;
};

export default function Table({ columns, content }: TableProp) {

  const cachedData = useMemo(() => content, []);
  // const rerender = useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data: cachedData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-full">
      <table 
        className="w-full text-left border-spacing-0 border-white/20 rounded-md"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="px-3 py-5 text-center align-bottom">
                <input type="checkbox"/>
              </th>
              {headerGroup.headers.map((header) => (
                <th className="px-3 py-5 align-bottom font-inter font-light border-b border-white/20" key={header.id}>
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
              <td className="px-3 py-3 text-center align-bottom">
                <input type="checkbox" />
              </td>
              {row.getVisibleCells().map((cell) => (
                <td className="px-3 py-2 font-inter font-light align-bottom" id={cell.id}>
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
