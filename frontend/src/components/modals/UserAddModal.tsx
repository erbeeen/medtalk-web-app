import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { UserType } from "../../types/user";
import { useState } from "react";
import CloseButton from "../buttons/CloseButton";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";

type NewUserModalProps = {
  onClose: () => void;
  setUsers: Dispatch<SetStateAction<Array<UserType>>>;
}

export default function UserAddModal({ onClose, setUsers }: NewUserModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setErrMessage("Invalid email address.");
      setIsLoading(false);
      return;
    }

    const newUser: UserType = {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
    };

    try {
      const body = JSON.stringify(newUser)
      const response = await fetch(`/api/users/admin/`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) {
        setErrMessage(`${result.data}.`);
        setIsLoading(false);
        return;
      }

      setUsers(prev =>
        [...prev, result.data]
      );
      onClose();
    } catch (err) {
      console.error("update user error: ", err);
      setErrMessage("Server error. Try again later.")
      setIsLoading(false);
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

        <form onSubmit={handleSubmit}>
          <div className="modal-input-container">
            <label htmlFor="username" className="w-8/12">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="modal-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              required
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
              required
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
              required
            />
          </div>

          {/* <div className="modal-input-container"> */}
          {/*   <label htmlFor="password" className="w-8/12">Password</label> */}
          {/*   <input */}
          {/*     type="password" */}
          {/*     id="password" */}
          {/*     name="password" */}
          {/*     className="modal-input" */}
          {/*     value={password} */}
          {/*     onChange={(e) => setPassword(e.target.value)} */}
          {/*     required */}
          {/*   /> */}
          {/* </div> */}

          {/* <div className="modal-input-container"> */}
          {/*   <label htmlFor="confirm-password" className="w-8/12">Confirm Password</label> */}
          {/*   <input */}
          {/*     type="password" */}
          {/*     id="confirm-password" */}
          {/*     name="confirm-password" */}
          {/*     className="modal-input" */}
          {/*     value={confirmPassword} */}
          {/*     onChange={(e) => setConfirmPassword(e.target.value)} */}
          {/*     required */}
          {/*   /> */}
          {/* </div> */}

          <div className="max-w-8/12 ml-auto text-center text-delete">
            {errMessage}
          </div>

          <div className="w-full mt-5 flex justify-between items-center">
            <CancelButton onClick={onClose} />
            <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
          </div>
        </form>


      </div>
    </div>
  )
}
