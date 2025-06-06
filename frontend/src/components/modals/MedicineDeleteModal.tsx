import type { Dispatch, SetStateAction } from "react";
import CloseButton from "../buttons/CloseButton";
import type { MedicineType } from "../../types/medicine";

type DeleteUserModalProps = {
  onClose: () => void;
  data: MedicineType | Record<string, string>;
  setMedicines: Dispatch<SetStateAction<Array<MedicineType>>>;
}

export default function MedicineDeleteModal({ onClose, data, setMedicines }: DeleteUserModalProps) {

  const isUserType = (data: any): data is MedicineType => {
    return (
      data !== null &&
      typeof data === "object" &&
      typeof data._id === "string" &&
      typeof data.username === "string" &&
      typeof data.email === "string"
    );
  }


  // const isMapType = (data: any): data is Record<string, boolean> => {
  //   return (
  //     typeof data === "object" &&
  //     data !== null &&
  //     Object.values(data).every(value => typeof value === "boolean")
  //   );
  // }

  const handleDelete = async () => {
    try {
      console.log("starting delete request");
      const response = await fetch(`/api/users/delete/?id=${data._id}`, {
        mode: "cors",
        method: "DELETE",
        credentials: "include",
      });

      const deletedUser = await response.json();
      console.log("data value:", deletedUser);

      if (deletedUser.success) {
        // if (isUserType(data)) {
        setMedicines(previous =>
          previous.filter(user =>
            user._id !== deletedUser.data._id
          )
        );
        // } else if (isMapType(data)) {
        //   for (const key of Object.keys(data)) {
        //     setUsers(previous =>
        //       previous.filter(user =>
        //         user._id !== key
        //       )
        //     );
        //   }
        // }
        onClose();
      }
    } catch (err) {
      console.error("delete user error: ", err);
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
