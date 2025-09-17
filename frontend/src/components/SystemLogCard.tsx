import { useState } from "react";
import type { SystemLogType } from "../types/systemlogs";
import LogsCategoryIcon from "./LogsCategoryIcon";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export default function SystemLogCard({ log }: { log: SystemLogType }) {
  const date = new Date(log.timestamp);
  const dateString = date.toLocaleString();
  const [showMore, setShowMore] = useState(false);
  const cursorPointer = log.data ? "cursor-pointer" : "";
  const detailsText = showMore ? "Hide Details" : "More Details";
  return (
    <div className={`py-2 ${cursorPointer}`} onClick={() => {
      setShowMore(!showMore);
    }}>
      <div className="flex flex-col items-start ">
        <div key={log._id} className="w-full pb-2 pl-3 flex flex-row justify-around">
          <div className="w-10/12">
            <h2 className="text-lg font-medium">{log.message}</h2>
            <p className="text-sm">{dateString}</p>
            {log.initiated_by && (
              <p className="text-sm">Initiated by: {log.initiated_by}</p>
            )}
            <div className="w-full py-1 flex flex-row justify-start gap-1">
              <LogsCategoryIcon label={log.level} />
              <LogsCategoryIcon label={log.category} />
            </div>
          </div>
          {log.data ? (
            <div className="w-2/12 flex flex-row justify-center items-center gap-1">
              <span className="text-sm">{detailsText}</span>
              {showMore ? <BsChevronUp /> : <BsChevronDown />}

            </div>

          ) : <div className="w-2/12" />
          }
        </div>
        <div className={`pl-6 transition-all duration-100 ease-in-out ${showMore ? 'my-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {log.data && (
            Object.entries(log.data).map(([key, value]) => (
              <p key={key} className="text-sm">
                {key}: {String(value)}
              </p>
            )
            ))}
        </div>
      </div>
      <hr className="w-full border-gray-400/30" />
    </div >
  );
}
