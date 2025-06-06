import type { ReactNode } from "react";

type SubmitButtonProps = {
  isLoading: boolean;
  children: ReactNode;
}

export default function SubmitButton({ isLoading, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={"button-layout dark:border-primary-dark/50 dark:hover:bg-primary-dark/70"}
      disabled={isLoading}
    >
      {isLoading ? <div className="spinner"></div> : children }
    </button>
  );
}
