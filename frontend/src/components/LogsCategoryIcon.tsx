export default function LogsCategoryIcon({ label }: { label: string }) { 
  if (label === "info") return (
    <div className="logs-category px-1 py-0.5 border-gray-500 bg-gray-200 dark:bg-gray-300 text-black cursor-default">
      <p className="text-[10px]">{label}</p>
    </div>
  )

  if (label !== "error") return (
    <div className="logs-category px-1 py-0.5 border-gray-500 bg-primary dark:bg-dark-primary text-white dark:text-black cursor-default">
      <p className="text-[10px]">{label}</p>
    </div>
  )

  if (label === "error") return (
    <div className="logs-category px-1 py-0.5 border-gray-500 bg-delete text-white cursor-default">
      <p className="text-[10px]">{label}</p>
    </div>
  )
}
