import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type MedicineSearchType = {
  name: string;
  count: number;
};

export default function Dashboard() {
  const dummyDaily: Array<MedicineSearchType> = [
    { name: "Acetaminophen", count: 120 },
    { name: "Ibuprofen", count: 90 },
    { name: "Dextromethorphan", count: 60 },
    // { name: "Loratadine", count: 30 },
    // { name: "Omeprazole", count: 25 },
    // { name: "Cimetidine", count: 15 },
  ];

  const dummyWeekly: Array<MedicineSearchType> = [
    { name: "Acetaminophen", count: 580 },
    { name: "Ibuprofen", count: 450 },
    { name: "Dextromethorphan", count: 400 },
    { name: "Loratadine", count: 320 },
    { name: "Omeprazole", count: 260 },
    // { name: "Cimetidine", count: 230 },
  ];

  const dummyMontly: Array<MedicineSearchType> = [
    { name: "Acetaminophen", count: 2000 },
    { name: "Ibuprofen", count: 1700 },
    { name: "Dextromethorphan", count: 1650 },
    { name: "Loratadine", count: 1400 },
    { name: "Omeprazole", count: 1178 },
    { name: "Cimetidine", count: 1024 },
    { name: "Citirizine", count: 1000 },
    { name: "Fexofenadine", count: 899 },
    { name: "Pseudoephedrine", count: 650 },
    { name: "Diphenhydramine", count: 344 },
  ];

  return (
    <div id="dashboard" className="w-full h-inherit flex flex-col gap-5 mt-5">

      <div className="flex flex-row justify-between gap-5">

        <div className="chart-container min-h-[300] w-5/12 min-w-[350px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
          <div className="w-full flex justify-between">
            <h1 className="chart-label">Top Daily Search</h1>
            <div className="border border-gray-700 rounded-lg">
              <input
                type="date"
                id="day-date"
                name="day-date"
                className="w-full px-5 py-2 outline-none m-0"
                value={"2025-02-01"}
                onChange={(e) => console.log("e.target.value: ", e.target.value)}
              />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={275}>
            <BarChart
              data={dummyDaily}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <XAxis
                type="category"
                dataKey="name"
                stroke="oklch(92.8% 0.006 264.531)"
                // angle={15}
                height={30}
                tickMargin={10}
                className="text-xs fill-gray-300"
              />
              <YAxis
                type="number"
                width={50}
                stroke="oklch(92.8% 0.006 264.531)"
                className="text-sm fill-gray-700"
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ color: "#040316" }}
              />
              <Legend wrapperStyle={{ paddingTop: "5px" }} />
              <Bar
                dataKey="count"
                barSize={70}
                fill="#027789"
                name="Search Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container min-h-[300] w-7/12 min-w-[350px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
          <div className="w-full flex justify-between">
            <h1 className="chart-label">Top Weekly Search</h1>
            <div className="border border-gray-700 rounded-lg">
              <input
                type="week"
                id="week-date"
                name="week-date"
                className="w-full px-5 py-2 outline-none m-0"
                value={"2025-W06"}
                onChange={(e) => console.log("e.target.value: ", e.target.value)}
              />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={275}>
            <BarChart
              data={dummyWeekly}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <XAxis
                type="category"
                dataKey="name"
                stroke="oklch(92.8% 0.006 264.531)"
                height={30}
                tickMargin={10}
                className="text-xs fill-gray-300"
              />
              <YAxis
                type="number"
                width={50}
                stroke="oklch(92.8% 0.006 264.531)"
                className="text-sm fill-gray-700"
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ color: "#040316" }}
              />
              <Legend wrapperStyle={{ paddingTop: "5px" }} />
              <Bar
                dataKey="count"
                barSize={50}
                fill="#027789"
                name="Search Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container min-h-[300] w-full min-w-[350px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
        <div className="w-full flex justify-between">
          <h1 className="chart-label">Top Monthly Search</h1>
          <div className="border border-gray-700 rounded-lg">
            <input
              type="month"
              id="month-date"
              name="month-date"
              className="w-full px-5 py-2 outline-none m-0"
              value={"2025-02"}
              onChange={(e) => console.log("e.target.value: ", e.target.value)}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={275}>
          <BarChart
            data={dummyMontly}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis
              type="category"
              dataKey="name"
              stroke="oklch(92.8% 0.006 264.531)"
              height={30}
              tickMargin={10}
              className="text-xs fill-gray-300"
            />
            <YAxis
              type="number"
              width={50}
              stroke="oklch(92.8% 0.006 264.531)"
              className="text-sm fill-gray-700"
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
              contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
              labelStyle={{ color: "#040316" }}
            />
            <Legend wrapperStyle={{ paddingTop: "5px" }} />
            <Bar
              dataKey="count"
              barSize={50}
              fill="#027789"
              name="Search Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
