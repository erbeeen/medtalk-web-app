import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import CloseButton from "../buttons/CloseButton";
import type { ScheduleType } from "../../types/schedule";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";

type EditUserModalProps = {
  onClose: () => void;
  data: ScheduleType;
  setSchedules: Dispatch<SetStateAction<Array<ScheduleType>>>;
}

export default function ScheduleEditModal({ onClose, data, setSchedules }: EditUserModalProps) {
  const originalDate = new Date(data.date);
  const originalYear = originalDate.getFullYear();
  const originalMonth = String(originalDate.getMonth() + 1).padStart(2, "0");
  const originalDay = String(originalDate.getDate()).padStart(2, "0");
  const originalHour = String(originalDate.getHours()).padStart(2, "0");
  const originalMinutes = String(originalDate.getMinutes()).padStart(2, "0");
  // const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  const formattedDate = `${originalYear}-${originalMonth}-${originalDay}`;
  const formattedTime = `${originalHour}:${originalMinutes}`;

  const [medicineName, setMedicineName] = useState(data.medicineName);
  const [measurement, setMeasurement] = useState(data.measurement);
  const [intakeInstruction, setIntakeInstruction] = useState(data.intakeInstruction);
  const [isTaken, setIsTaken] = useState(Boolean(data.isTaken));
  const [date, setDate] = useState(formattedDate);
  const [time, setTime] = useState(formattedTime);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();
    if (
      !medicineName ||
      !measurement ||
      !intakeInstruction ||
      isTaken === undefined ||
      !date ||
      !time
    ) {
      setErrMessage("Provide all fields.")
      setIsLoading(false);
      return;
    }

    // const datetimeString = `${date}T${time}:00`;
    // const dateObject = new Date(datetimeString);
    // const finalDate = dateObject.toISOString().replace("Z", "+00:00");

    // const updatedData: ScheduleType = {
    //   userID: data.userID,
    //   medicineName: medicineName,
    //   measurement: measurement,
    //   intakeInstruction: intakeInstruction,
    //   isTaken: String(isTaken),
    //   date: finalDate
    // };

    // try {
    //   const body = JSON.stringify(updatedData);
    //   const response = await fetch(`/api/schedule/?id=${data._id}`, {
    //     mode: "cors",
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: body,
    //     credentials: "include",
    //   });
    //   const result = await response.json();
    //
    //   if (!result.success) {
    //     setErrMessage(`${result.data}.`);
    //     setIsLoading(false);
    //     return;
    //   }
    //
    //   setSchedules(prevData =>
    //     prevData.map((schedule) =>
    //       schedule._id === result.data._id ? { ...schedule, ...updatedData } : schedule
    //     )
    //   );
    //   onClose();
    // } catch (err) {
    //   console.error("update schedule error: ", err);
    //   setErrMessage("Server error. Try again later.")
    //   setIsLoading(false);
    // }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col gap-4 bg-light dark:bg-[#181924] rounded-xl text-left"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-full mt-3 mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Edit Schedule</h1>
          <CloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="is-taken" className="w-8/12">Already Taken?</label>
            <div className="modal-input flex justify-start border-none">
              <input
                type="checkbox"
                id="is-taken"
                name="is-taken"
                className="cursor-pointer"
                checked={isTaken}
                onChange={(e) => setIsTaken(e.target.checked)}
              />
            </div>
          </div>

          <div className="modal-input-container">
            <label htmlFor="date" className="w-8/12">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              className="modal-input"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="time" className="w-8/12">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={time}
              className="modal-input"
              onChange={(e) => {
                setTime(e.target.value);
              }}
            />
          </div>

          <div className="max-w-8/12 ml-auto text-center dark:text-delete-dark/70">
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
