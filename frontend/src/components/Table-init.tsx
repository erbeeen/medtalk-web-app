import { useMemo } from "react";
import { useTable } from "react-table";

export default function Table({ columns, contents }) {
  const cachedColumns = useMemo(() => columns, []);
  const cachedData = useMemo(() => contents, []);

  const tableInstance = useTable({
    columns: cachedColumns,
    data: cachedData,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;

  return (
    <table className="w-full my-2" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
            {headerGroup.headers.map((column) => (
              <th className="px-3 text-left" {...column.getHeaderProps()} key={column.getHeaderProps().key}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                  <td className="px-3 text-left" {...cell.getCellProps()} key={cell.getCellProps().key}>
                    {cell.render("Cell")}
                  </td>
                ))
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
