import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import CloseButton from "../buttons/CloseButton";
import type { MedicineType } from "../../types/medicine";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";

type EditUserModalProps = {
  onClose: () => void;
  data: MedicineType;
  setMedicines: Dispatch<SetStateAction<Array<MedicineType>>>;
}

export default function MedicineEditModal({ onClose, data, setMedicines }: EditUserModalProps) {
  const [level1, setLevel1] = useState(data["Level 1"]);
  const [level2, setLevel2] = useState(data["Level 2"]);
  const [level3, setLevel3] = useState(data["Level 3"]);
  const [level4, setLevel4] = useState(data["Level 4"]);
  const [molecule, setMolecule] = useState(data.Molecule);
  const [route, setRoute] = useState(data.Route);
  const [technicalSpec, setTechnicalSpec] = useState(data["Technical Specifications"]);
  const [atcCode, setAtcCode] = useState(data["ATC Code"]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();

    if (
      !level1 ||
      !level2 ||
      !level3 ||
      !molecule ||
      !route ||
      !technicalSpec ||
      !atcCode
    ) {
      setErrMessage("*Provide all fields.")
      setIsLoading(false);
      return;
    }

    const updatedData: MedicineType = {
      "Level 1": level1,
      "Level 2": level2,
      "Level 3": level3,
      "Level 4": level4,
      Molecule: molecule,
      Route: route,
      "Technical Specifications": technicalSpec,
      "ATC Code": atcCode,
    };

    try {
      console.log("starting edit medicine request");
      const body = JSON.stringify(updatedData)
      const response = await fetch(`/api/medicine/update/?id=${data._id}`, {
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
        setIsLoading(false);
        return;
      }

      setMedicines(prevData =>
        prevData.map((medicine) =>
          medicine._id === result.data._id ? { ...medicine, ...updatedData } : medicine
        )
      );
      onClose();
    } catch (err) {
      console.error("update medicine error: ", err);
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
          <h1 className="text-xl font-bold">Create Medicine</h1>
          <CloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-input-container">
            <label htmlFor="level-1" className="w-8/12">Level 1</label>
            <input
              id="level-1"
              name="level-1"
              type="text"
              className="modal-input"
              value={level1}
              onChange={(e) => setLevel1(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="level-2" className="w-8/12">Level 2</label>
            <input
              type="text"
              id="level-2"
              name="level-2"
              className="modal-input"
              value={level2}
              onChange={(e) => setLevel2(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="first-name" className="w-8/12">Level 3</label>
            <input
              type="text"
              id="level-3"
              name="level-3"
              className="modal-input"
              value={level3}
              onChange={(e) => setLevel3(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="last-name" className="w-8/12">Level 4</label>
            <input
              type="text"
              id="level-4"
              name="level-4"
              className="modal-input"
              value={level4}
              onChange={(e) => setLevel4(e.target.value)}
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="password" className="w-8/12">Molecule</label>
            <input
              type="text"
              id="molecule"
              name="molecule"
              className="modal-input"
              value={molecule}
              onChange={(e) => setMolecule(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="route" className="w-8/12">Route</label>
            <input
              type="text"
              id="route"
              name="route"
              className="modal-input"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="technical-specification" className="w-8/12">Technical Specification</label>
            <input
              type="text"
              id="technical-specification"
              name="technical-specification"
              className="modal-input"
              value={technicalSpec}
              onChange={(e) => setTechnicalSpec(e.target.value)}
              required
            />
          </div>

          <div className="modal-input-container">
            <label htmlFor="atc-code" className="w-8/12">ATC Code</label>
            <input
              type="text"
              id="atc-code"
              name="atc-code"
              className="modal-input"
              value={atcCode}
              onChange={(e) => setAtcCode(e.target.value)}
              required
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
