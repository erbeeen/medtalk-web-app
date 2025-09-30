import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useState } from "react";
import CloseButton from "../buttons/CloseButton";
import type { ScheduleType } from "../../types/schedule";
import type { FormattedSchedule } from "../../types/formatted-schedule";
import SubmitButton from "../buttons/SubmitButton";
import CancelButton from "../buttons/CancelButton";
import { useUser } from "../../contexts/UserContext";

type NewUserModalProps = {
  onClose: () => void;
  setSchedules: Dispatch<SetStateAction<Array<FormattedSchedule>>>;
  userID: string | undefined;
  doctorName: string;
}

export default function ScheduleAddModal({ onClose, setSchedules, userID, doctorName }: NewUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [times, setTimes] = useState<Array<string>>([]);
  const [errMessage, setErrMessage] = useState("");
  const { user } = useUser();

  console.log('doctor name: ', doctorName);
  

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleAddTime = () => {
    setTimes([...times, ""]);
  }

  const handleTimeChange = (index: number, newTime: string) => {
    const newTimes = [...times];
    newTimes[index] = newTime;
    setTimes(newTimes);
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
  };
  const todayDate = getTodayDateString();


  const generateIndividualSchedules = async (schedule: FormattedSchedule) => {
    const { medicineName, measurement, startDate, endDate } = schedule;
    const scheduleArray: ScheduleType[] = [];
    let currentDate = new Date(startDate);
    const endLimit = new Date(endDate);
    endLimit.setDate(endLimit.getDate() + 1);
    let assignedBy;

    assignedBy = doctorName;
    if (!doctorName) {
      assignedBy = user?.id;
    }

    while (currentDate < endLimit) {
      const dateStr = currentDate.toISOString().slice(0, 10); // "YYYY-MM-DD"

      for (const time of times) {
        const [hours, minutes] = time.split(':');
        const isoDateTime = `${dateStr}T${hours}:${minutes}:00.000Z`;
        const intakeDate = isoDateTime;

        scheduleArray.push({
          userID: String(userID),
          medicineName: medicineName,
          measurement: measurement,
          intakeInstruction: `Take at ${time}`,
          isTaken: 'false',
          date: intakeDate,
          assignedBy: String(assignedBy),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return scheduleArray;
  }


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const schedule: FormattedSchedule = {
        medicineName: medicineName,
        measurement: measurement,
        startDate,
        endDate,
        intakeTimes: times,
      }

      const scheduleArray = await generateIndividualSchedules(schedule);
      const body = {
        schedules: scheduleArray
      };

      const response = await fetch("/api/schedule", {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      })

      if (response.status === 201) {
        const formattedIntakeTimes: string[] = [];
        for (let i = 0; i < schedule.intakeTimes.length; i++) {
          const temp = schedule.intakeTimes[i];
          const hour = Number(temp.substring(0, 2));
          const minute = temp.substring(3);
          if (hour > 12) {
            formattedIntakeTimes[i] = `0${hour - 12}:${minute} pm`
          } else {
            formattedIntakeTimes[i] = `${hour}:${minute} am`;
          }
        }
        schedule.intakeTimes = formattedIntakeTimes;
        schedule.assignedBy = doctorName;
        setSchedules((prev) => [schedule, ...prev]);
        onClose();
      }

      setIsLoading(false);
    } catch (err) {
      console.error("error saving schedule: ", err);
      setErrMessage("Server error. Try again later.");
      setIsLoading(false);
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="max-h-10/12 px-16 py-5 z-10 flex flex-col gap-4 bg-light dark:bg-[#181924] rounded-xl overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-full mt-3 mb-5 flex justify-between items-center">
          <h1 className="text-xl font-bold">Add New Schedule</h1>
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
            <label htmlFor="confirm-password" className="w-8/12">Start Date</label>
            <input
              type="date"
              id="start-date"
              name="start-date"
              className="modal-input"
              min={todayDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="confirm-password" className="w-8/12">End Date</label>
            <input
              type="date"
              id="end-date"
              name="end-date"
              className="modal-input"
              min={todayDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center gap-1 mt-4">
            <label className="mb-3">Intake Time</label>
            {/* 3. Render an input field for each time */}
            {times.map((time, index) => (
              <div key={index} className="modal-input-container">
                <label htmlFor={`time-${index}`} className="w-6/12">Time {index + 1}</label>
                <div className="w-6/12 flex items-center gap-1">
                  <input
                    type="time" // Use type="time" for time input
                    id={`time-${index}`}
                    name={`time-${index}`}
                    className="modal-input"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                  />
                  {times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="text-delete hover:text-delete/70 font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTime}
              className="self-end mt-2 py-2 px-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out dark:bg-blue-800 dark:hover:bg-blue-900 cursor-pointer"
            >
              + Add Entry
            </button>
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
