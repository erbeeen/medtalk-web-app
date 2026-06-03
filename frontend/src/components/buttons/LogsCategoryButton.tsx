import { useState, useEffect } from "react";
type LogsCategoryButtonProps = {
  label: string;
  value: string;
  updateFilters?: (filterName: string, isActive: Boolean) => void;
  setIsErrorFilterOn?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LogsCategoryButton({ label, value, updateFilters, setIsErrorFilterOn }: LogsCategoryButtonProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (value !== "error" && updateFilters !== undefined)
      updateFilters(value, isActive);
    if (value === "error" && setIsErrorFilterOn !== undefined)
      setIsErrorFilterOn((prev) => !prev);
  }, [isActive]);

  if (label !== "error") return (
    <div
      className={`logs-category 
        ${!isActive ? 'hover:bg-primary dark:hover:bg-dark-primary hover:text-white dark:hover:text-black' : 'bg-primary dark:bg-dark-primary text-white dark:text-black'}
      `}
      onClick={() => {
        setIsActive(prev => !prev);
      }}
    >
      <button className="text-xs cursor-pointer">{label}</button>
    </div>
  );

  if (label === "error") return (
    <div
      className={`logs-category 
        ${!isActive ? 'hover:bg-delete hover:text-white' : 'bg-delete text-white'}
      `}
      onClick={() => {
        setIsActive(prev => !prev);
      }}
    >
      <button className="text-xs cursor-pointer">{label}</button>
    </div>
  );
}

