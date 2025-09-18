import { useState, useEffect } from "react";
type LogsCategoryButtonProps = {
  label: string;
  updateFilters: (filterName: string, isActive: Boolean) => void;
}

export default function LogsCategoryButton({ label, updateFilters }: LogsCategoryButtonProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    updateFilters(label, isActive);
  }, [isActive]);

  return (
    <div
      className={`logs-category ${!isActive ? 'bg-gray-700/40 hover:bg-gray-700/80' : 'bg-gray-700/80'}`}
      onClick={() => {
        setIsActive(prev => !prev);
      }}
    >
      <button className="text-xs cursor-pointer">{label}</button>
    </div>
  );
}

