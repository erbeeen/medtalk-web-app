import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";

type ScrollTableProps = {
  props: CellContext<any, any>;
  value?: any;
}

export default function ScrollTableData({ props, value }: ScrollTableProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`py-2 overflow-x-scroll transition-all duration-150 ease-in-out ${!isHovered ? "hide-scrollbar" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value !== undefined ? value : props.getValue()}
    </div>
  )
}
