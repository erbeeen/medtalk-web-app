import type { Dispatch, SetStateAction } from "react";
import type { UserType } from "../../types/user";
import { useState } from "react";
import CloseButton from "../CloseButton";

type NewUserModalProps = {
  onClose: () => void;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function UserAddModal({ onClose, setUsers }: NewUserModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    const newUser: UserType = {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };


    try {
      console.log("starting create user request");
      const body = JSON.stringify(newUser)
      const response = await fetch(`/api/users/register/`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        credentials: "include",
      });

      console.log("parsing data into json");
      const result = await response.json();
      console.log("data value:", result);
      console.log("result.data._id value", result.data._id);

      if (result.success) {
        setUsers(prev =>
          [result.data, ...prev]
        );

        onClose();
      }
    } catch (err) {
      console.error("update user error: ", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col gap-4 bg-light dark:bg-[#181924] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-full mt-3 mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Create User</h1>
          <CloseButton onClose={onClose} />
        </div>

        <div className="modal-input-container">
          <label htmlFor="username" className="w-8/12">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="modal-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="email" className="w-8/12">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="first-name" className="w-8/12">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="modal-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="last-name" className="w-8/12">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="modal-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="password" className="w-8/12">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="confirm-password" className="w-8/12">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            className="modal-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={handleSubmit}
          >
            Submit
            {/* <button type="button" className="cursor-pointer" onClick={handleSubmit}>Submit</button> */}
          </div>
        </div>

      </div>
    </div>
  )
}
