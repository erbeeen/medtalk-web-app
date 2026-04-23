import React, { useState, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { MedicineType } from "../../types/medicine";
import { useUser } from "../../contexts/UserContext";
import type { UserType } from "../../types/user";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CloseButton from "../buttons/CloseButton";
import SubmitButton from "../buttons/SubmitButton";

type MedicineAnalyticsProps = {
  medicine: MedicineType;
  showModal: boolean;
  onClose: () => void;
};

type StatType = {
  month: string;
  count: number;
};

export default function MedicineAnalytics({ medicine, showModal, onClose }: MedicineAnalyticsProps) {
  const { user } = useUser();
  const[doctorDetails, setDoctorDetails] = useState<UserType>();
  const [stats, setStats] = useState<StatType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const[isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    
    const fetchDoctorDetails = async () => {
      try {
        if (!user?.id) return;
        const response = await fetch(`/api/users/?id=${user.id}`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (result.success) {
          setDoctorDetails(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/medicine/statistics?medicineName=${encodeURIComponent(medicine.Molecule)}`, {
          mode: "cors",
          method: "GET",
          credentials: "include"
        });
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorDetails();
    fetchStats();
  }, [showModal, medicine.Molecule, user?.id]);

  const handleOnEscapeKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
  };

  const generatePDF = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    try {
      const page1 = document.getElementById("pdf-page-1");
      const page2 = document.getElementById("pdf-page-2");
      if (!page1 || !page2) return;

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvas1 = await html2canvas(page1, { scale: 2 });
      const imgData1 = canvas1.toDataURL("image/png");
      pdf.addImage(imgData1, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.addPage();

      const canvas2 = await html2canvas(page2, { scale: 2 });
      const imgData2 = canvas2.toDataURL("image/png");
      pdf.addImage(imgData2, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save(`${medicine.Molecule}-Report.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  if (!showModal) return null;

  const today = new Date();
  const generatedDate = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  const formattedStats = stats.map(s => {
    const [year, month] = s.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...s,
      displayDate: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      fullDisplayDate: date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    };
  });

  const startMonth = formattedStats.length > 0 ? formattedStats[0].fullDisplayDate : "";
  const endMonth = formattedStats.length > 0 ? formattedStats[formattedStats.length - 1].fullDisplayDate : "";

  return createPortal(
    <div tabIndex={0} onKeyDown={handleOnEscapeKeydown} className="fixed inset-0 z-50 flex justify-center items-center py-10">
      <div className="fixed inset-0 bg-black/50" aria-hidden={true} onClick={onClose}></div>
      <div 
        className="z-10 flex flex-col bg-white dark:bg-[#181924] rounded-xl overflow-hidden shadow-2xl h-full max-h-[90vh] w-11/12 max-w-[900px]"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-[#181924]">
          <h2 className="text-xl font-bold">Medicine Report</h2>
          <div className="flex items-center gap-4">
            <form onSubmit={generatePDF}>
              <SubmitButton isLoading={isPdfGenerating}>Download PDF</SubmitButton>
            </form>
            <CloseButton onClose={onClose} />
          </div>
        </div>

        <div className="overflow-y-auto p-8 bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-8">
          <div id="pdf-page-1" className="w-[800px] h-[1131px] p-12 flex flex-col bg-white text-black box-border shrink-0 shadow-sm relative">
            <h1 className="text-4xl font-bold mb-2">Product Performance Report: {medicine.Molecule}</h1>
            <p className="text-lg text-gray-600 mb-6">By: {doctorDetails?.firstName || user?.username} {doctorDetails?.lastName || ""}</p>
            <hr className="border-t-2 border-black mb-6" />
            
            <h2 className="text-2xl font-semibold mb-4">{medicine.Molecule} ({medicine["ATC Code"]})</h2>
            
            <h3 className="text-xl font-medium mb-4">Drug Profile</h3>
            <table className="w-full border-collapse border border-black mb-8 text-left">
              <tbody>
                <tr>
                  <th className="border border-black p-3 font-medium w-1/3">Route</th>
                  <td className="border border-black p-3">{medicine.Route || "-"}</td>
                </tr>
                <tr>
                  <th className="border border-black p-3 font-medium">Technical Specification</th>
                  <td className="border border-black p-3">{medicine["Technical Specifications"] || "-"}</td>
                </tr>
                <tr>
                  <th className="border border-black p-3 font-medium">ATC Level 1 Info</th>
                  <td className="border border-black p-3">{medicine["Level 1"] || "-"}</td>
                </tr>
                <tr>
                  <th className="border border-black p-3 font-medium">ATC Level 2 Info</th>
                  <td className="border border-black p-3">{medicine["Level 2"] || "-"}</td>
                </tr>
                <tr>
                  <th className="border border-black p-3 font-medium">ATC Level 3 Info</th>
                  <td className="border border-black p-3">{medicine["Level 3"] || "-"}</td>
                </tr>
                <tr>
                  <th className="border border-black p-3 font-medium">ATC Level 4 Info</th>
                  <td className="border border-black p-3">{medicine["Level 4"] || "-"}</td>
                </tr>
              </tbody>
            </table>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between text-sm text-gray-500 border-t border-gray-300 pt-4">
              <span>Page 1 of 2</span>
              <span>Generated on {generatedDate}</span>
            </div>
          </div>

          <div id="pdf-page-2" className="w-[800px] h-[1131px] p-12 flex flex-col bg-white text-black box-border shrink-0 shadow-sm relative">
            <h2 className="text-2xl font-semibold mb-8">
              Sales Performance {startMonth && endMonth ? `(${startMonth} - ${endMonth})` : ""}
            </h2>

            <div className="w-full mb-8 border border-black p-8 flex justify-center">
              {isLoading ? (
                <div className="flex justify-center items-center h-[368px]">Loading chart...</div>
              ) : (
                <LineChart width={670} height={368} data={formattedStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                  <XAxis dataKey="displayDate" stroke="#000" tick={{ fill: '#000' }} />
                  <YAxis stroke="#000" tick={{ fill: '#000' }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#000" }} itemStyle={{ color: "#000" }} />
                  <Line type="monotone" dataKey="count" stroke="#000" strokeWidth={2} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </div>

            <table className="w-full border-collapse border border-black text-left">
              <thead>
                <tr>
                  <th className="border border-black p-3 font-medium">Date</th>
                  <th className="border border-black p-3 font-medium">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {formattedStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="border border-black p-3">{stat.fullDisplayDate}</td>
                    <td className="border border-black p-3">{stat.count}</td>
                  </tr>
                ))}
                {formattedStats.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={2} className="border border-black p-3 text-center">No sales data available</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between text-sm text-gray-500 border-t border-gray-300 pt-4">
              <span>Page 2 of 2</span>
              <span>Generated on {generatedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
