import { MdClose } from "react-icons/md";

type CloseButtonProps = {
  onClose: () => void;
};

export default function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <div
      className="p-2 -mr-2 flex justify-center items-center dark:hover:bg-gray-700/50 rounded-xl cursor-pointer"
      onClick={onClose}
    >
      <MdClose size="1.7rem" />
    </div>
  );
}
