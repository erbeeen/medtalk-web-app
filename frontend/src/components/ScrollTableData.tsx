import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";

type ScrollTableProps = {
  props: CellContext<any, string | undefined>;
}

export default function ScrollTableData({ props }: ScrollTableProps) {
  console.log("ScrollTableData data: ", props.getValue());
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`py-2 overflow-x-scroll ${!isHovered ? "hide-scrollbar" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.getValue()}
    </div>
  )
}
