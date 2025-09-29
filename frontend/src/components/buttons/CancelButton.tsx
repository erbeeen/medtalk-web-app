type CancelButtonProps = {
  onClick: () => void;
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button
      type="button"
      className="button-layout bg-gray-200 dark:bg-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-400/80"
      onClick={onClick}
    >
      Cancel
    </button>
  );
}
