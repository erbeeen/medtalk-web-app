import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa"
import { MdClose } from "react-icons/md";

type SearchBarProps = {
  onChange: (e: any) => void;
  searchFn: () => void;
  clearFn: () => void;
  value: any;
}

// FIX: when searching for paracetamol and ibuprofen on medicine,
// no results show but records on the database exist. Bug might exist
// on other types of searches

export default function SearchBar({ onChange, searchFn, clearFn, value }: SearchBarProps) {
  const [isTextboxClear, setisTextboxClear] = useState(true);

  const isFirefox = navigator.userAgent.includes("Firefox");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-8 w-full m-0 flex items-center bg-gray-200 text-light-text dark:bg-gray-500/20 dark:text-dark-text rounded-4xl">
      <div
        className="h-full w-16 flex justify-center 
        items-center rounded-l-4xl cursor-pointer
        transition-colors duration-75 ease-in-out active:bg-primary-dark/50"
        onClick={searchFn}
      >
        <FaSearch size="1.2rem" className="ml-auto" />
        <div className="h-7/12 w-[1px] rounded-4xl ml-auto bg-black/20 dark:bg-white/20" />
      </div>
      <input
        className="h-8 w-full px-6 m-0 outline-none text-sm"
        ref={inputRef}
        type="search"
        placeholder="Search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value === "") {
            clearFn();
            setisTextboxClear(true);
          } else {
            setisTextboxClear(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchFn();
          }
        }}
      />
      {isFirefox && (
        <div className={`h-full w-16 flex justify-center items-center
          rounded-r-4xl cursor-pointer dark:text-dark-text/50
          dark:hover:text-dark-text ${(!isTextboxClear && isFirefox) ? "" : "invisible"}`}
          onClick={() => {
            clearFn();
            setisTextboxClear(true);
            inputRef.current?.focus();
          }}
        >
          <MdClose size="1.2rem" />
        </div>
      )}
    </div>
  )
}
