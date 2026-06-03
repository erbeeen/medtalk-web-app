import type { ReactNode } from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
  isLoading: boolean;
  children: ReactNode;
};

export default function SubmitButton({ isLoading, children, className, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={"button-layout transition-colors duration-[50] bg-primary hover:bg-primary/90 text-light"}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <div className="spinner"></div> : children }
    </button>
  );
}
