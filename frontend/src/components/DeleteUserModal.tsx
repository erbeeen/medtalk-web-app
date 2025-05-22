import type { Dispatch, SetStateAction } from "react";
import { FaTrashAlt } from "react-icons/fa";
import type { UserType } from "../types/user";

type DeleteUserModalProps = {
  onClose: () => void;
  data: UserType;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function DeleteUserModal({ onClose, data, setUsers }: DeleteUserModalProps ) {

  const handleDelete = () => {
    setUsers(previous => 
      previous.filter(user => 
        user.id !== data.id
      )
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col bg-secondary/80 dark:bg-primary-dark/50 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="self-center">Confirm Deletion?</h1>
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
