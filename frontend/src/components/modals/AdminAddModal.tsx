import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { AdminUserType } from "../../types/user";
import { useState } from "react";
import CloseButton from "../buttons/CloseButton";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";

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
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  // const passwordRegex: RegExp =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~-])[A-Za-z\d!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~-]{8,}$/;
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();
    if (
      !role ||
      !username ||
      !email ||
      !firstName ||
      !lastName
      // !password ||
      // !confirmPassword
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

    // if (password !== confirmPassword) {
    //   setErrMessage("Password does not match.");
    //   setIsLoading(false);
    //   return;
    // }

    // if (!passwordRegex.test(password)) {
    //   setErrMessage("Password must be at least 8 characters with a mix of characters, numbers, and symbols.");
    //   setIsLoading(false);
    //   return;
    // }

    const newAdmin: AdminUserType = {
      role: role,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      // password: password,
    };

    try {
      const body = JSON.stringify(newAdmin);
      const response = await fetch("/api/users/admin/register/", {
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

      setAdmins(prev =>
        [...prev, result.data]
      );
      onClose();
    } catch (err) {
      console.error("create admin error: ", err);
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
          <h1 className="text-xl font-bold">Create Admin</h1>
          <CloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-input-container">
            <label htmlFor="role" className="w-8/12">Role</label>
            <select
              name="role"
              id="role"
              className="modal-input"
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
              }}
            >
              <option value="">Select an option</option>
              <option value="admin">Admin</option>
              <option value="super admin">Super Admin</option>
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

          {/* <div className="modal-input-container"> */}
          {/*   <label htmlFor="password" className="w-8/12">Password</label> */}
          {/*   <input */}
          {/*     type="password" */}
          {/*     id="password" */}
          {/*     name="password" */}
          {/*     className="modal-input" */}
          {/*     value={password} */}
          {/*     onChange={(e) => setPassword(e.target.value)} */}
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
          {/*   /> */}
          {/* </div> */}

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
