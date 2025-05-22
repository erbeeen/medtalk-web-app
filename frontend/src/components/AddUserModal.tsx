import type { Dispatch, SetStateAction } from "react";
import type { UserType } from "../types/user";
import { useState } from "react";

type NewUserModalProps = {
  onClose: () => void;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function AddUserModal({ onClose, setUsers }: NewUserModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    const newUser: UserType = {
      id: "69420",
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };

    setUsers(previous => [...previous, newUser]);
    onClose();
  }
  
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col bg-light dark:bg-[#181924] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="self-center">Edit User</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className="modal-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          className="modal-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="first-name">First Name</label>
        <input
          type="text"
          id="first-name"
          name="first-name"
          className="modal-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="last-name">Last Name</label>
        <input
          type="text"
          id="last-name"
          name="last-name"
          className="modal-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="modal-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          className="modal-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="mt-5 flex justify-around items-center ">
          <button type="button" className="cursor-pointer" onClick={onClose}>Cancel</button>
          <button type="button" className="cursor-pointer" onClick={() => handleSubmit()}>Submit</button>
        </div>
      </div>
    </div>
  )
}
