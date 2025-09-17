export default function LogsCategoryIcon({ label }: { label: string }) { 
  return (
    <div className="logs-category px-1 py-0.5 border-gray-700/80 bg-gray-700/40 cursor-default">
      <p className="text-[10px]">{label}</p>
    </div>
  )
}
