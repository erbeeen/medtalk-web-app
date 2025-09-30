import type { ReactNode } from "react";

type DeleteButtonProps = {
  isLoading: boolean;
  children: ReactNode;
}

export default function DeleteButton({ isLoading, children }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className={"button-layout bg-delete hover:bg-delete/70 text-white"}
      disabled={isLoading}
    >
      {isLoading ? <div className="spinner"></div> : children }
    </button>
  );
}
