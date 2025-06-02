import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import CloseButton from "../CloseButton";
import type { MedicineType } from "../../types/medicine";

type NewUserModalProps = {
  onClose: () => void;
  setMedicines: Dispatch<SetStateAction<Array<MedicineType>>>;
}

export default function MedicineAddModal({ onClose, setMedicines }: NewUserModalProps) {
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [level4, setLevel4] = useState("");
  const [molecule, setMolecule] = useState("");
  const [route, setRoute] = useState("");
  const [technicalSpec, setTechnicalSpec] = useState("");
  const [atcCode, setAtcCode] = useState("");

  const handleSubmit = async () => {
    const newMedicine: MedicineType = {
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
      console.log("starting new medicine request");
      const body = JSON.stringify(newMedicine)
      const response = await fetch(`http://localhost:3000/api/users/register/`, {
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
        setMedicines(prev =>
          [result.data, ...prev]
        );

        onClose();
      }
    } catch (err) {
      console.error("update user error: ", err);
    }
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
          <h1 className="text-xl font-bold">Create Medicine</h1>
          <CloseButton onClose={onClose} />
        </div>

        <div className="modal-input-container">
          <label htmlFor="level-1" className="w-8/12">Level 1</label>
          <input
            id="level-1"
            name="level-1"
            type="text"
            className="modal-input"
            value={level1}
            onChange={(e) => setLevel1(e.target.value)}
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
