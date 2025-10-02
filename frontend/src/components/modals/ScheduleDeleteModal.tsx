import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { ScheduleType } from "../../types/schedule";
import CloseButton from "../buttons/CloseButton";
import CancelButton from "../buttons/CancelButton";
import DeleteButton from "../buttons/DeleteButton";

type DeleteUserModalProps = {
  onClose: () => void;
  data: ScheduleType | Record<string, string>;
  setSchedules: Dispatch<SetStateAction<Array<ScheduleType>>>;
}

export default function ScheduleDeleteModal({ onClose, data, setSchedules }: DeleteUserModalProps) {
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isScheduleType = (data: any): data is ScheduleType => {
    return (
      data !== null &&
      typeof data === "object" &&
      typeof data._id === "string" &&
      typeof data.medicineName === "string" &&
      typeof data.measurement === "string"
    );
  }


  // const isMapType = (data: any): data is Record<string, boolean> => {
  //   return (
  //     typeof data === "object" &&
  //     data !== null &&
  //     Object.values(data).every(value => typeof value === "boolean")
  //   );
  // }

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();

    if (isScheduleType(data)) {
      try {
        console.log("starting delete request");
        const response = await fetch(`/api/schedule/?id=${data._id}`, {
          mode: "cors",
          method: "DELETE",
          credentials: "include",
        });

        const result = await response.json();

        if (!result.success) {
          setErrMessage(`${result.data}.`);
          setIsLoading(false);
          return;
        }

        setSchedules(previous =>
          previous.filter(schedule =>
            schedule._id !== result.data._id
          )
        );
        onClose();
      } catch (err) {
        console.error("delete schedule error: ", err);
        setErrMessage("Server error. Try again later.");
        setIsLoading(false);
      }
    } else {
      console.log("starting batch schedule delete request");
      const idList: Array<String> = [];
      for (const key of Object.keys(data)) {
        idList.push(key);
      }

      try {
        const body = JSON.stringify(idList);
        const response = await fetch("/api/schedule/batch", {
          mode: "cors",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
          credentials: "include",
        });

        const result = await response.json();

        if (!result.success) {
          setErrMessage(`${result.data}.`);
          setIsLoading(false);
          return;
        }

        setSchedules(previousSchedules => {
          const deletedIdsSet = new Set(idList);
          return previousSchedules.filter((schedule) => {
            if (schedule._id === undefined) return true;
            return !deletedIdsSet.has(schedule._id);
          });
        })
        onClose();
      } catch (err) {
        console.error("delete schedules error: ", err);
        setErrMessage("Server error. Try again later.");
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="w-2/12 min-w-[300px] max-w-[350px] px-10 py-5 z-10 flex flex-col bg-light dark:bg-[#181924] border dark:border-gray-700/40 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Delete</h1>
          <CloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleDelete}>
          <h1 className="self-center">{isScheduleType(data) ? "Confirm deletion?" : "Delete selected?"}</h1>

          <div className="max-w-8/12 ml-auto text-center text-delete">
            {errMessage}
          </div>

          <div className="w-full mt-5 flex justify-between items-center cursor-pointer">
            <CancelButton onClick={onClose} />
            <DeleteButton isLoading={isLoading}>Delete</DeleteButton>
          </div>

        </form>
      </div>
    </div>
  )
}
