import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { type MedicineSearchType } from "../types/medicine-search";

type PdfTemplateProps = {
  reportRef: React.RefObject<HTMLDivElement | null>;
  currentDate: Date;
  dailyDate: string;
  dailyData: Array<MedicineSearchType>;
  weeklyDate: string;
  weeklyData: Array<MedicineSearchType>;
  monthlyDate: string;
  monthlyData: Array<MedicineSearchType>;
  emptyData: Array<MedicineSearchType>;
}


export default function PdfTemplate({ reportRef, currentDate, dailyDate, dailyData, weeklyDate, weeklyData, monthlyDate, monthlyData, emptyData }: PdfTemplateProps) {
  const formatYAxisToWholeNumbers = (value: number) => {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return '';
  };

  return (
    <>
      <div
        id="dashboard"
        className="w-full h-inherit flex flex-col gap-5 mt-2"
        ref={reportRef}
      >

        <div
          id="analytics-report"
          className="w-full h-inherit p-5 flex flex-col gap-5 text-light-text"
        >
          <div className="mb-[20px]">
            <h1>Drug Trends Analytics Report</h1>
            <h2>Report Generated: {currentDate.toLocaleString()}</h2>
          </div>

          <div className="flex flex-row justify-between gap-5">
            {/* NOTE: Daily Chart */}
            <div className="chart-container min-h-[300] w-5/12 min-w-[350px] bg-white rounded-lg flex flex-col items-center justify-center">
              <div className="w-full flex justify-between">
                <h1 className="chart-label">Top Daily Search</h1>
                <div className="px-2 flex justify-center items-center text-xs border border-gray-700 rounded-lg whitespace-nowrap">
                  <p>{dailyDate}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={275}>
                <BarChart
                  data={dailyData.length > 0 ? dailyData : emptyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis
                    type="category"
                    dataKey="name"
                    stroke="#000"
                    angle={dailyData.find((data) => data.name.length > 10) ? 10 : 0}
                    height={30}
                    tickMargin={10}
                    padding={"no-gap"}
                    className="text-[10px] fill-black"
                  />
                  <YAxis
                    type="number"
                    width={50}
                    stroke="#000"
                    tickFormatter={formatYAxisToWholeNumbers}
                    className="text sm fill-black"
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    labelStyle={{ color: "#040316" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    dataKey="count"
                    barSize={70}
                    fill="#14967F"
                    name="Search Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* NOTE: Weekly Chart */}
            <div className="chart-container min-h-[300] w-7/12 min-w-[350px] bg-white rounded-lg flex flex-col items-center justify-center">
              <div className="w-full flex justify-between">
                <h1 className="chart-label">Top Weekly Search</h1>
                <div className="px-2 flex justify-center items-center text-xs border border-gray-700 rounded-lg whitespace-nowrap">
                  <p>{weeklyDate}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={275}>
                <BarChart
                  data={weeklyData.length > 0 ? weeklyData : emptyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis
                    type="category"
                    dataKey="name"
                    stroke="#000"
                    angle={weeklyData.find((data) => data.name.length > 10) ? 10 : 0}
                    height={30}
                    tickMargin={10}
                    className="text-[10px] fill-gray-300"
                    padding={"no-gap"}
                  />
                  <YAxis
                    type="number"
                    width={50}
                    stroke="#000"
                    tickFormatter={formatYAxisToWholeNumbers}
                    className="text-sm fill-gray-700"
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    labelStyle={{ color: "#040316" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    dataKey="count"
                    barSize={50}
                    fill="#14967F"
                    name="Search Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NOTE: Monthly Chart */}
          <div className="chart-container min-h-[300] w-full min-w-[700px] bg-white rounded-lg flex flex-col items-center justify-center">
            <div className="w-full flex justify-between">
              <h1 className="chart-label">Top Monthly Search</h1>
              <div className="px-2 flex justify-center items-center text-xs border border-gray-700 rounded-lg whitespace-nowrap">
                <p>{monthlyDate}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={275}>
              <BarChart
                data={monthlyData.length > 0 ? monthlyData : emptyData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis
                  type="category"
                  dataKey="name"
                  stroke="#000"
                  angle={monthlyData.find((data) => data.name.length > 15) ? 10 : 0}
                  height={30}
                  tickMargin={10}
                  className="text-xs fill-gray-300"
                />
                <YAxis
                  type="number"
                  width={50}
                  tickFormatter={formatYAxisToWholeNumbers}
                  stroke="#000"
                  className="text-sm fill-gray-700"
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                  contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                  labelStyle={{ color: "#040316" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar
                  dataKey="count"
                  barSize={50}
                  fill="#14967F"
                  name="Search Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mx-5 mt-5 flex justify-between text-[14px] border border-gray-700 rounded divide-x divide-gray-700">
            <div className="w-4/12">
              <p className="w-full px-1 border-b border-gray-700">Searches for the Day:</p>
              {dailyData.map((data, index) => {
                index++;
                return <p className="px-1">{index}. {data.name} ({data.count})</p>
              })}
            </div>

            <div className="w-4/12">
              <p className="w-full px-1 border-b border-gray-700">Searches for the Week:</p>
              {weeklyData.map((data, index) => {
                index++;
                return <p className="px-1">{index}. {data.name} ({data.count})</p>
              })}
            </div>

            <div className="w-4/12">
              <p className="w-full px-1 border-b border-gray-700">Searches for the Month:</p>
              {monthlyData.map((data, index) => {
                index++;
                return <p className="px-1">{index}. {data.name} ({data.count})</p>
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
