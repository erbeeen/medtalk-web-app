import { useState, useRef } from "react";

import {
  type AccessorKeyColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleDoubleRight,
  FaAngleRight
} from "react-icons/fa";


type TableProps = {
  columns: Array<AccessorKeyColumnDef<any, any>>;
  content: Array<any>;
  columnFilters?: Array<any>;
  rowSelection?: RowSelectionState
  globalFilter?: any;
  setGlobalFilter?: OnChangeFn<any>;
  scrollToTop: () => Promise<void>;
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
};

// FIX: scrolling to top screws up when adding new entries
// and possibly causing it are pages having only one entry.
// either fix the bug or only make the table scrollable

export default function Table({
  columns,
  content,
  columnFilters,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  setGlobalFilter,
  scrollToTop,
}: TableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    data: content,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    getRowId: row => row._id,
    enableRowSelection: true,
    onRowSelectionChange: onRowSelectionChange,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      globalFilter,
      columnFilters,
      rowSelection: rowSelection,
      pagination: pagination,
    },
  });

  return (
    <div id="table-ref" ref={tableRef} className="h-full w-full border border-dark/10 dark:border-light/10 rounded-2xl overflow-auto">
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
                  }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
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

      <div className={`w-full p-3 flex justify-center items-center gap-2 ${table.getPageCount() <= 0 ? "hidden py-5" : ""}`}>

        <div className={
          `p-1.5 flex justify-center items-center border rounded-sm 
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${table.getCanPreviousPage() ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (table.getCanPreviousPage()) {
              table.firstPage();
              scrollToTop();
            }
          }}>
          <button className={table.getCanPreviousPage() ? "cursor-pointer" : ""}>
            <FaAngleDoubleLeft />
          </button>
        </div>

        <div className={`p-1.5 flex justify-center items-center border rounded-sm 
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${table.getCanPreviousPage() ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (table.getCanPreviousPage()) {
              table.previousPage();
              scrollToTop();
            }
          }}>
          <button className={table.getCanPreviousPage() ? "cursor-pointer" : ""}>
            <FaAngleLeft />
          </button>
        </div>

        <span className="mx-2 text-xs dark:text-dark-text/80">
          {`${pagination.pageIndex + 1} of ${table.getPageCount()}`}
        </span>

        <div className={`p-1.5 flex justify-center items-center border rounded-sm
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${table.getCanNextPage() ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (table.getCanNextPage()) {
              scrollToTop();
              table.nextPage();
            }
          }}>
          <button className={`${table.getCanNextPage() ? "cursor-pointer" : ""}`}>
            <FaAngleRight />
          </button>
        </div>
        <div className={`p-1.5 flex justify-center items-center border rounded-sm
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${table.getCanNextPage() ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (table.getCanNextPage()) {
              table.lastPage();
              scrollToTop();
            }
          }}>
          <button className={table.getCanNextPage() ? "cursor-pointer" : ""}>
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
    </div>
  );
}
