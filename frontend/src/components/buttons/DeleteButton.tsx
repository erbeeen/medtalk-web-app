import type { ReactNode } from "react";

type DeleteButtonProps = {
  isLoading: boolean;
  children: ReactNode;
}

export default function DeleteButton({ isLoading, children }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className={"button-layout dark:border-delete-dark/50 dark:hover:bg-delete-dark/70"}
      disabled={isLoading}
    >
      {isLoading ? <div className="spinner"></div> : children }
    </button>
  );
}
