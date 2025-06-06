import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import CloseButton from "../buttons/CloseButton";
import type { ScheduleType } from "../../types/schedule";

type NewUserModalProps = {
  onClose: () => void;
  setSchedules: Dispatch<SetStateAction<Array<ScheduleType>>>;
}

export default function ScheduleAddModal({ onClose, setSchedules }: NewUserModalProps) {
  const [userID, setUserID] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [intakeInstruction, setIntakeInstruction] = useState("");
  const [isTaken, setIsTaken] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    const newUser: ScheduleType = {
      userID: userID,
      medicineName: medicineName,
      measurement: measurement,
      intakeInstruction: intakeInstruction,
      isTaken: isTaken,
      date: date,
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
        setSchedules(prev =>
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
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="email" className="w-8/12">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="modal-input"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="first-name" className="w-8/12">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="modal-input"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="last-name" className="w-8/12">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="modal-input"
            value={intakeInstruction}
            onChange={(e) => setIntakeInstruction(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="password" className="w-8/12">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="modal-input"
            value={isTaken}
            onChange={(e) => setIsTaken(e.target.value)}
          />
        </div>

        <div className="modal-input-container">
          <label htmlFor="confirm-password" className="w-8/12">Confirm Password</label>
          <input
            type="text"
            id="confirm-password"
            name="confirm-password"
            className="modal-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
