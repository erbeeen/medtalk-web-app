import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Table({ contents, type }) {
  const columnHelper = createColumnHelper<typeof type>();
}
