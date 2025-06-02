import { useState, type Dispatch, type SetStateAction } from "react";
import type { UserType } from "../../types/user"
import CloseButton from ".././CloseButton";

type EditUserModalProps = {
  onClose: () => void;
  data: UserType;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

// TODO: 
// add animations
// add api request to edit record on database

export default function UserEditModal({ onClose, data, setUsers }: EditUserModalProps) {
  const [username, setUsername] = useState(data.username);
  const [email, setEmail] = useState(data.email);
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);

  const handleSubmit = async () => {
    const updatedData: UserType = {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
    };

    try {
      console.log("starting update request");
      const response = await fetch(`http://localhost:3000/api/users/update/?id=${data._id}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      console.log("parsing data into json");
      const updatedUser = await response.json();
      console.log("data value:", updatedUser);

      if (updatedUser.success) {
        setUsers(prevData =>
          prevData.map((user) =>
            user._id === updatedUser.data._id ? { ...user, ...updatedData } : user
          )
        );
        onClose();
      }
    } catch (err) {
      console.error("update user error: ", err);
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center text-left" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col gap-4 bg-light dark:bg-[#181924] border dark:border-gray-700/40 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full mt-3 mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Edit User</h1>
          <CloseButton onClose={onClose} />
        </div>

        <div className="modal-input-container">
          <label htmlFor="username" className="w-6/12">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="modal-input"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="email" className="w-6/12">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="modal-input"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="first-name" className="w-6/12">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="modal-input"
            placeholder="first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="last-name" className="w-6/12">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="modal-input"
            placeholder="last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="w-full mt-5 flex justify-between items-center cursor-pointer">
          <div
            className="py-2 px-5 font-medium text-sm border rounded-4xl dark:border-secondary-dark/70 dark:hover:bg-secondary-dark/70"
            onClick={onClose}
          >
            <button type="button" className="cursor-pointer" onClick={onClose}>Cancel</button>
          </div>

          <div
            className="py-2 px-5 font-medium text-sm border rounded-4xl dark:border-primary-dark/50 dark:hover:bg-primary-dark/70"
            onClick={onClose}
          >
            <button type="button" className="cursor-pointer" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}
