import { useState, useRef, useEffect } from "react";

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
  scrollToTop: () => void;
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
  onRowClick: (row: any) => void;
};

export default function Table({
  columns,
  content,
  columnFilters,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  setGlobalFilter,
  scrollToTop,
  onRowClick
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

  useEffect(() => {
    table.resetPageIndex();
  }, [content]);

  return (
    <>
      <div className={`w-full px-3 flex justify-center items-center gap-2 overflow-x-clip ${table.getPageCount() <= 1 ? "hidden py-5" : ""}`}>

        <div className={
          `p-1 flex justify-center items-center border rounded-sm 
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

        <div className={`p-1 flex justify-center items-center border rounded-sm 
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

        <div className={`p-1 flex justify-center items-center border rounded-sm
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
        <div className={`p-1 flex justify-center items-center border rounded-sm
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
      <div id="table-ref" ref={tableRef} className="w-full border border-dark/10 dark:border-light/10 rounded-xl overflow-x-scroll">
        <table className="w-full text-left border-collapse border-spacing-0 table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#15977f] text-white border-b border-dark/10 dark:border-light/10 rounded-2xl">
                {headerGroup.headers.map((header) => (
                  <th
                    className="p-3 align-middle text-sm font-medium"
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
          <tbody className="flex-1 overflow-y-scroll">
            {/* FIX: When clicking the checkbox it opens the modal for analytics */}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => onRowClick(row.original)}
                className="border-b border-dark/10 dark:border-light/10 text-sm font-medium align-middle cursor-pointer
                hover:bg-zinc-200 dark:hover:bg-[#CCECEE]/10 transition duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="py-1 px-4" key={cell.id} id={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div className={`w-full px-3 mb-5 flex justify-center items-center gap-2 overflow-x-clip ${table.getPageCount() <= 1 ? "hidden py-5" : ""}`}>

        <div className={
          `p-1 flex justify-center items-center border rounded-sm 
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

        <div className={`p-1 flex justify-center items-center border rounded-sm 
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

        <div className={`p-1 flex justify-center items-center border rounded-sm
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
        <div className={`p-1 flex justify-center items-center border rounded-sm
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
    </>
  );
}
