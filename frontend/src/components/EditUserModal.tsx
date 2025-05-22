import { useState, type Dispatch, type SetStateAction } from "react";
import type { UserType } from "../types/user"

type EditUserModalProps = {
  onClose: () => void;
  data: UserType;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

// TODO: create this properly

export default function EditUserModal({ onClose, data, setUsers }: EditUserModalProps) {
  const [username, setUsername] = useState(data.username);
  const [email, setEmail] = useState(data.email);
  const [firstName, setFirstName] = useState(data.firstName)
  const [lastName, setLastName] = useState(data.lastName)

  const handleSubmit = () => {
    const updatedData: UserType = {
      id: data.id,
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: data.password,
    };

    setUsers(prevData =>
      prevData.map((user) =>
        user.id === updatedData.id ? { ...updatedData } : user
      )
    );

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
        <div className="mt-5 flex justify-around items-center ">
          <button type="button" className="cursor-pointer" onClick={onClose}>Cancel</button>
          <button type="button" className="cursor-pointer" onClick={() => handleSubmit()}>Submit</button>
        </div>
      </div>
    </div>
  )
}
