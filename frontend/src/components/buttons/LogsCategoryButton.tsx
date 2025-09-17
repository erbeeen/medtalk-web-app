type LogsCategoryButtonProps = {
  label: string;
}

export default function LogsCategoryButton({ label }: LogsCategoryButtonProps) {
  return (
    <div className="logs-category border-gray-700/80 bg-gray-700/40 hover:bg-gray-700/80">
      <button className="text-xs cursor-pointer">{label}</button>
    </div>
  );
}

