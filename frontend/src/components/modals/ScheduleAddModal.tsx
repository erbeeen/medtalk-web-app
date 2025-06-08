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
    const newSchedule: ScheduleType = {
      userID: userID,
      medicineName: medicineName,
      measurement: measurement,
      intakeInstruction: intakeInstruction,
      isTaken: isTaken,
      date: date,
    };


    try {
      console.log("starting create user request");
      const body = JSON.stringify(newSchedule)
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
          [...prev, result.data]
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

        <form onSubmit={handleSubmit}>
          <div className="modal-input-container">
            <label htmlFor="user-id" className="w-8/12">User ID</label>
            <input
              type="text"
              id="user-id"
              name="user-id"
              className="modal-input"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="medicine-name" className="w-8/12">Medicine Name</label>
            <input
              type="text"
              id="medicine-name"
              name="medicine-name"
              className="modal-input"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="measurement" className="w-8/12">Measurement</label>
            <input
              type="text"
              id="measurement"
              name="measurement"
              className="modal-input"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="intake-instruction" className="w-8/12">Intake Instruction</label>
            <input
              type="text"
              id="intake-instruction"
              name="intake-instruction"
              className="modal-input"
              value={intakeInstruction}
              onChange={(e) => setIntakeInstruction(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="is-taken" className="w-8/12">Already Taken</label>
            <input
              type="checkbox"
              id="is-taken"
              name="is-taken"
              className="modal-input"
              value={isTaken}
              onChange={(e) => {
                console.log("e.target.value: ", e.target.value);
                setIsTaken(e.target.value);
              }}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="confirm-password" className="w-8/12">Confirm Password</label>
            <input
              type="date"
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
        </form>


      </div>
    </div>
  )
}
