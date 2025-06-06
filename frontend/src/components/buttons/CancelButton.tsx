type CancelButtonProps = {
  onClick: () => void;
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button
      type="button"
      className="button-layout dark:border-secondary-dark/70 dark:hover:bg-secondary-dark/70"
      onClick={onClick}
    >
      Cancel
    </button>
  );
}
