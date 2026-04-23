import { createPortal } from "react-dom";
import type { MedicineType } from "../../types/medicine"

type MedicineAnalyticsProps = {
  medicine: MedicineType;
  showModal: boolean;
  onClose: () => void;
};

// TODO: Create the design for the medicine analytics
// Check if you can do different pages without printing it to pdf first or not
export default function MedicineAnalytics({ medicine, showModal, onClose }: MedicineAnalyticsProps) {

  const handleOnEscapeKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("keydown function triggered");
    
    if (e.key === "Escape") onClose();
  }

  if (!showModal) return;

  return createPortal(
    <div onClick={onClose} tabIndex={0} onKeyDown={handleOnEscapeKeydown} className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden={true}>
      </div>
      <div
        className="px-16 py-5 z-10 flex flex-col gap-4 bg-light dark:bg-[#181924] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-[635px] h-[898px] bg-white text-black">
          medisina
        </div>
      </div>
    </div>,
    document.body
  )
}

