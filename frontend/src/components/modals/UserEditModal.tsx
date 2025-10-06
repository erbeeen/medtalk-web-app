import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { UserType } from "../../types/user"
import CloseButton from "../buttons/CloseButton";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import { useToast } from "../../contexts/ToastProvider";

type EditUserModalProps = {
  onClose: () => void;
  data: UserType;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function UserEditModal({ onClose, data, setUsers }: EditUserModalProps) {
  const [username, setUsername] = useState(data.username);
  const [email, setEmail] = useState(data.email);
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { addToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();

    if (
      !username ||
      !email ||
      !firstName ||
      !lastName
    ) {
      setErrMessage("Provide all fields.");
      addToast("Failed to edit user.", { type: "error" });
      setIsLoading(false);
      return;
    }

    if (
      data.username === username &&
      data.email === email &&
      data.firstName === firstName &&
      data.lastName === lastName
    ) {
      setErrMessage("No changes were made.");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setErrMessage("Invalid email address.");
      addToast("Failed to edit user.", { type: "error" });
      setIsLoading(false);
      return;
    }

    let updatedData: any = {
      firstName: firstName,
      lastName: lastName,
    };

    if (data.email !== email)
      updatedData.email = email;

    if (data.username !== username)
      updatedData.username = username;

    try {
      const body = JSON.stringify(updatedData);
      const response = await fetch(`/api/users/update/?id=${data._id}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        credentials: "include",
      });
      const result = await response.json();

      if (!result.success) {
        setErrMessage(`${result.data}.`);
        addToast("Failed to edit user.", { type: "error" });
        setIsLoading(false);
        return;
      }

      setUsers(prevData =>
        prevData.map((user) =>
          user._id === result.data._id ? { ...user, ...updatedData } : user
        )
      );
      addToast("User edited.");
      onClose();
    } catch (err) {
      console.error("update user error: ", err);
      setErrMessage("Server error. Try again later.")
      addToast("Failed to edit user.", { type: "error" });
      setIsLoading(false);
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

        <form onSubmit={handleSubmit}>
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className="max-w-8/12 ml-auto text-center text-delete">
            {errMessage}
          </div>

          <div className="w-full mt-5 flex justify-between items-center cursor-pointer">
            <CancelButton onClick={onClose} />
            <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
