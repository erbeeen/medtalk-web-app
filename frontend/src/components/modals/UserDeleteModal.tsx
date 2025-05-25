import type { Dispatch, SetStateAction } from "react";
import type { UserType } from "../../types/user";
import CloseButton from "../CloseButton";

type DeleteUserModalProps = {
  onClose: () => void;
  data: UserType | Record<string, string>;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function UserDeleteModal({ onClose, data, setUsers }: DeleteUserModalProps) {

  const isUserType = (data: any): data is UserType => {
    return (
      data !== null &&
      typeof data === "object" &&
      typeof data._id === "string" &&
      typeof data.username === "string" &&
      typeof data.email === "string"
    );
  }


  const isMapType = (data: any): data is Record<string, boolean> => {
    return (
      typeof data === "object" &&
      data !== null &&
      Object.values(data).every(value => typeof value === "boolean")
    );
  }

  const handleDelete = () => {
    if (isUserType(data)) {
      setUsers(previous =>
        previous.filter(user =>
          user._id !== data._id
        )
      );
    } else if (isMapType(data)) {
      for (const key of Object.keys(data)) {
        setUsers(previous =>
          previous.filter(user =>
            user._id !== key
          )
        );
      }
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="w-2/12 px-10 py-5 z-10 flex flex-col bg-light dark:bg-[#181924] border dark:border-gray-700/40 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full  mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Delete</h1>
          <CloseButton onClose={onClose} />
        </div>
        <h1 className="self-center">{isUserType(data) ? "Confirm deletion?" : "Delete selected?"}</h1>
        <div className="w-full mt-5 flex justify-between items-center cursor-pointer">
          <div
            className="py-2 px-5 font-medium text-sm border rounded-4xl dark:border-secondary-dark/70 dark:hover:bg-secondary-dark/70 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </div>

          <div
            className="py-2 px-5 font-medium text-sm border rounded-4xl dark:border-delete-dark/50 dark:hover:bg-delete-dark/70"
            onClick={handleDelete}
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  )
}
