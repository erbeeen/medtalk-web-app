import type { ReactNode } from "react";

type SubmitButtonProps = {
  isLoading: boolean;
  children: ReactNode;
}

export default function SubmitButton({ isLoading, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={"button-layout transition-colors duration-[50] bg-primary hover:bg-primary/90 text-light"}
      disabled={isLoading}
    >
      {isLoading ? <div className="spinner"></div> : children }
    </button>
  );
}
