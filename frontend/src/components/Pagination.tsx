import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, limit, total, onPageChange, className, ...props }: PaginationProps) {
  const start = page;
  const end = total === 0 ? 1 : Math.ceil(total / limit);
  const canPrev = page > 1;
  const canNext = page < Math.ceil(total / limit);

  const goStart = () => {
    if (canPrev) {
      onPageChange(1);
    }
  }

  const goPrev = () => {
    if (canPrev) {
      onPageChange(page - 1);
    }
  }

  const goNext = () => {
    if (canNext) {
      onPageChange(page + 1);
    }
  }

  const goEnd = () => {
    if (canNext) {
      onPageChange(end);
    }
  }

  if (total === 0) return;

  return (
    <div
      className={`w-full px-3 mb-5 flex justify-center items-center gap-2 overflow-x-clip ${className}`}
      {...props}
    >

      <button
        className={
          `p-1 flex justify-center items-center border rounded-sm 
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${canPrev && "cursor-pointer"}`}
        disabled={!canPrev}
        onClick={goStart}
      >
        <FaAngleDoubleLeft />
      </button>

      <button
        className={`p-1 flex justify-center items-center border rounded-sm 
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${canPrev && "cursor-pointer"}`}
        onClick={goPrev}
        disabled={!canPrev}
      >
        <FaAngleLeft />
      </button>

      <span className="mx-2 text-xs dark:text-dark-text/80">
        {`${start} of ${end}`}
      </span>

      <button
        className={`p-1 flex justify-center items-center border rounded-sm
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${canNext && "cursor-pointer"}`}
        onClick={goNext}
        disabled={!canNext}
      >
        <FaAngleRight />
      </button>
      <button
        className={`p-1 flex justify-center items-center border rounded-sm
          dark:border-secondary-dark/50 dark:hover:bg-secondary/50 
          dark:text-secondary-dark/50 dark:hover:text-dark-text 
          ${canNext && "cursor-pointer"}`}
        onClick={goEnd}
        disabled={!canNext}
      >
        <FaAngleDoubleRight />
      </button>
    </div >
  );
}
