import type { Dispatch, SetStateAction } from "react";
import type { AdminUserType } from "../../types/user";
import { useState } from "react";
import CloseButton from "../buttons/CloseButton";

type NewUserModalProps = {
  onClose: () => void;
  setAdmins: Dispatch<SetStateAction<Array<AdminUserType>>>;
}

export default function AdminAddModal({ onClose, setAdmins }: NewUserModalProps) {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    const newAdmin: AdminUserType = {
      role: role,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };

    setAdmins(previous => [newAdmin, ...previous]);
    onClose();
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
          <h1 className="text-xl font-bold">Create Admin</h1>
          <CloseButton onClose={onClose} />
        </div>

        <div className="modal-input-container">
          <label htmlFor="role" className="w-8/12">Role</label>
          <select 
            name="role" 
            id="role" 
            className="modal-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin" className="text-black">Admin</option>
            <option value="super admin" className="text-black">Super Admin</option>
          </select>
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
            onClick={onClose}
          >
            <button type="button" className="cursor-pointer" onClick={handleSubmit}>Submit</button>
          </div>
        </div>

      </div>
    </div>
  )
}
