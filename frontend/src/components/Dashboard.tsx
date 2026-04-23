import { useState, useEffect, useRef, type FormEvent, } from "react";
import { createRoot } from "react-dom/client";
import { useDebounce } from "use-debounce";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import userPrefersDarkMode from "../contexts/DarkModeContext";
import SubmitButton from "./buttons/SubmitButton";
import { type MedicineSearchType } from "../types/medicine-search";
import PdfTemplate from "./PdfTemplate";
import type { UserType } from "../types/user";
import { useUser } from "../contexts/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const isDarkMode = userPrefersDarkMode();
  const reportRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const formattedMonth = `${year}-${month}`;
  const [dailyDate, setDailyDate] = useState(formattedDate);
  const [dailyData, setDailyData] = useState<Array<MedicineSearchType>>([]);
  const [_debouncedDaily] = useDebounce(dailyData, 1000);
  const [weeklyDate, setWeeklyDate] = useState(formattedDate);
  const [weeklyData, setWeeklyData] = useState<Array<MedicineSearchType>>([]);
  const [_debouncedWeek] = useDebounce(weeklyData, 1000);
  const [monthlyDate, setMonthlyDate] = useState(formattedMonth);
  const [monthlyData, setMonthlyData] = useState<Array<MedicineSearchType>>([]);
  const [_debouncedMonth] = useDebounce(monthlyData, 1000);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserType>();
  const emptyData: Array<MedicineSearchType> = [{ name: "", count: 0 }];

  const fetchUserDetails = async () => {
    try {
      if (!user?.id) return;
      const response = await fetch(`/api/users/?id=${user.id}`, {
        mode: "cors",
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setUserDetails(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDailyAnalytics = async () => {
    try {
      const result = await fetch(`/api/analytics/day/?date=${dailyDate}`, {
        mode: "cors",
        method: "GET",
        credentials: "include"
      });
      const data = await result.json();
      setDailyData(data.data);
    } catch (err) {
      console.log(`error getting daily analytics: ${err}`);
    }
  }

  const getWeeklyAnalytics = async () => {
    try {
      const result = await fetch(`/api/analytics/week/?date=${weeklyDate}`, {
        mode: "cors",
        method: "GET",
        credentials: "include"
      });
      const data = await result.json();
      setWeeklyData(data.data);

    } catch (err) {
      console.log(`error getting weekly analytics: ${err}`);
    }
  }

  const getMonthlyAnalytics = async () => {
    try {
      const result = await fetch(`/api/analytics/month/?date=${monthlyDate}`, {
        mode: "cors",
        method: "GET",
        credentials: "include"
      });
      const data = await result.json();
      setMonthlyData(data.data);

    } catch (err) {
      console.log(`error getting monthly analytics: ${err}`);
    }
  }

  const formatYAxisToWholeNumbers = (value: number) => {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return '';
  };

  const generatePDF = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    await document.fonts.ready;

    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    const root = createRoot(tempContainer);
    root.render(
      <PdfTemplate
        generatedBy={`${userDetails?.firstName} ${userDetails?.lastName}`}
        reportRef={reportRef}
        currentDate={currentDate}
        dailyDate={dailyDate}
        dailyData={dailyData}
        weeklyDate={weeklyDate}
        weeklyData={weeklyData}
        monthlyDate={monthlyDate}
        monthlyData={monthlyData}
        emptyData={emptyData}
      />
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const reportElement = reportRef.current;
      if (!reportElement) {
        setIsLoading(false);
        return;
      }

      const scale = 2;
      const width = reportElement.offsetWidth * scale;
      const height = reportElement.offsetHeight * scale;

      const imgData = await domtoimage.toBlob(reportElement, {
        quality: 0.8,
        bgcolor: "#ffffff",
        width,
        height,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${reportElement.offsetWidth}px`,
          height: `${reportElement.offsetHeight}px`
        }
      });
      const img = new Image();
      const objectUrl = URL.createObjectURL(imgData);

      img.onload = () => {
        const imgWidthPx = img.width;
        const imgHeightPx = img.height;

        const pxToMm = (px: number) => px * 25.4 / 96;

        const imgWidthMm = pxToMm(imgWidthPx);
        const imgHeightMm = pxToMm(imgHeightPx);

        const pdf = new jsPDF("portrait", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let scaledWidth = imgWidthMm;
        let scaledHeight = imgHeightMm;

        if (imgWidthMm > pageWidth || imgHeightMm > pageHeight) {
          const widthRatio = pageWidth / imgWidthMm;
          const heightRatio = pageHeight / imgHeightMm;
          const scale = Math.min(widthRatio, heightRatio);

          scaledWidth = imgWidthMm * scale;
          scaledHeight = imgHeightMm * scale;
        }
        // const xPos = (pageWidth - scaledWidth) / 2;
        // const yPos = (pageHeight - scaledHeight) / 3;
        pdf.addImage(img, "JPEG", 0, 0, scaledWidth, scaledHeight);
        pdf.save(`${formattedDate}-analytics-report.pdf`);
        URL.revokeObjectURL(objectUrl);
        tempContainer.remove();
        root.unmount();
      }
      img.src = objectUrl;
    } catch (err) {
      console.log('error generating pdf: ', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    getDailyAnalytics();
  }, [dailyDate]);

  useEffect(() => {
    getWeeklyAnalytics();
  }, [weeklyDate]);

  useEffect(() => {
    if (monthlyDate && /^\d{4}-\d{2}$/.test(monthlyDate)) {
      getMonthlyAnalytics();
    }
  }, [monthlyDate]);

  return (
    <>

      <form className="self-end" onSubmit={generatePDF}>
        <SubmitButton isLoading={isLoading}>Export to PDF</SubmitButton>
      </form>

      <div
        id="dashboard"
        className="w-full h-inherit flex flex-col gap-5 mt-5"
      >

        <div
          id="analytics-report"
          className="w-full h-inherit p-2 pb-5 flex flex-col gap-5"
        >
          <div className="flex flex-row justify-between gap-5">
            {/* NOTE: Daily Chart */}
            <div className="chart-container min-h-[300] w-5/12 min-w-[350px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
              <div className="w-full flex justify-between">
                <h1 className="chart-label">Top Daily Search</h1>
                <div className="flex justify-center items-center text-xs border border-gray-700 rounded-lg">
                  <input
                    type="date"
                    id="day-date"
                    name="day-date"
                    className="w-full px-3 py-1 outline-none m-0"
                    value={dailyDate}
                    onChange={(e) => {
                      setDailyDate(e.target.value);
                    }}
                  />
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
                    stroke={`${isDarkMode ? 'white' : 'black'}`}
                    angle={dailyData.find((data) => data.name.length > 10) ? 10 : 0}
                    height={30}
                    tickMargin={10}
                    padding={"no-gap"}
                    className="text-[10px] fill-black"
                  />
                  <YAxis
                    type="number"
                    width={50}
                    stroke={`${isDarkMode ? 'white' : 'black'}`}
                    tickFormatter={formatYAxisToWholeNumbers}
                    className="text-sm fill-gray-700"
                  />
                  <Tooltip
                    cursor={!isDarkMode ? { fill: "rgba(0, 0, 0, 0.05)" } : { fill: "rgba(255, 255, 255, 0.2)" }}
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    labelStyle={{ color: "#040316" }}
                    itemStyle={{ color: "#000" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    dataKey="count"
                    barSize={70}
                    fill={!isDarkMode ? "#14967F" : "#CCECEE"}
                    name="Search Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* NOTE: Weekly Chart */}
            <div className="chart-container min-h-[300] w-7/12 min-w-[350px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
              <div className="w-full flex justify-between">
                <h1 className="chart-label">Top Weekly Search</h1>
                <div className="flex justify-center items-center text-xs border border-gray-700 rounded-lg">
                  <input
                    type="date"
                    id="week-date"
                    name="week-date"
                    className="w-full px-5 py-2 outline-none m-0"
                    value={weeklyDate}
                    onChange={(e) => {
                      setWeeklyDate(e.target.value);
                    }}
                  />
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
                    // stroke="oklch(92.8% 0.006 264.531)"
                    stroke={`${isDarkMode ? 'white' : 'black'}`}
                    angle={dailyData.find((data) => data.name.length > 10) ? 10 : 0}
                    height={30}
                    tickMargin={10}
                    className="text-xs fill-gray-300"
                  />
                  <YAxis
                    type="number"
                    width={50}
                    // stroke="oklch(92.8% 0.006 264.531)"
                    stroke={`${isDarkMode ? 'white' : 'black'}`}
                    tickFormatter={formatYAxisToWholeNumbers}
                    className="text-sm fill-gray-700"
                  />
                  <Tooltip
                    cursor={!isDarkMode ? { fill: "rgba(0, 0, 0, 0.05)" } : { fill: "rgba(255, 255, 255, 0.2)" }}
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    labelStyle={{ color: "#040316" }}
                    itemStyle={{ color: "#000" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    dataKey="count"
                    barSize={50}
                    fill={!isDarkMode ? "#14967F" : "#CCECEE"}
                    name="Search Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NOTE: Monthly Chart */}
          <div className="chart-container min-h-[300] w-full min-w-[700px] dark:bg-dark rounded-lg flex flex-col items-center justify-center">
            <div className="w-full flex justify-between">
              <h1 className="chart-label">Top Monthly Search</h1>
              <div className="flex justify-center items-center text-xs border border-gray-700 rounded-lg">
                <input
                  type="month"
                  id="month-date"
                  name="month-date"
                  className="w-full px-5 py-2 outline-none m-0"
                  value={monthlyDate}
                  onChange={(e) => {
                    setMonthlyDate(e.target.value);
                  }}
                />
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
                  stroke={`${isDarkMode ? 'white' : 'black'}`}
                  angle={dailyData.find((data) => data.name.length > 15) ? 5 : 0}
                  height={30}
                  tickMargin={10}
                  className="text-xs fill-gray-300"
                />
                <YAxis
                  type="number"
                  width={50}
                  stroke={`${isDarkMode ? 'white' : 'black'}`}
                  tickFormatter={formatYAxisToWholeNumbers}
                  className="text-sm fill-gray-700"
                />
                <Tooltip
                  cursor={!isDarkMode ? { fill: "rgba(0, 0, 0, 0.05)" } : { fill: "rgba(255, 255, 255, 0.2)" }}
                  contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                  labelStyle={{ color: "#040316" }}
                  itemStyle={{ color: "#000" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar
                  dataKey="count"
                  barSize={50}
                  fill={!isDarkMode ? "#14967F" : "#CCECEE"}
                  name="Search Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </>
  );
}
