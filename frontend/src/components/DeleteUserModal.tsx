import type { Dispatch, SetStateAction } from "react";
import { FaTrashAlt } from "react-icons/fa";
import type { UserType } from "../types/user";

type DeleteUserModalProps = {
  onClose: () => void;
  data: UserType | Record<string, string>;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

// TODO: fix styling

export default function DeleteUserModal({ onClose, data, setUsers }: DeleteUserModalProps) {

  const isUserType = (data: any): data is UserType => {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof data.id === "string" &&
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col bg-secondary/80 dark:bg-primary-dark/50 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="self-center">{isUserType(data) ? "Confirm deletion?" : "Delete selected?"}</h1>
        <div className="mt-5 flex justify-around items-center ">
          <button type="button" className="cursor-pointer" onClick={onClose}>Cancel</button>
          <button type="button" className="cursor-pointer" onClick={() => handleDelete()}>
            <div className="flex gap-1 justify-center items-center">
              <FaTrashAlt />
              Delete
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
