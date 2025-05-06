import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaPills, FaCalendarAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="h-screen w-56 p-4 flex flex-col gap-1.5 font-light border-r border-white z-10 bg-gray-900">
      <Link to="/" className="sidebar-link">
        <div className="sidebar-icon">
          <MdDashboard />
        </div>
        <span className="w-8/12">Dashboard</span>
      </Link>
      <Link to="/users" className="sidebar-link">
        <div className="sidebar-icon">
          <FaUser />
        </div>
        <span className="w-8/12">Users</span>
      </Link>
      <Link to="/medicine" className="sidebar-link">
        <div className="sidebar-icon">
          <FaPills />
        </div>
        <span className="w-8/12">Medicine</span>
      </Link>
      <Link to="/schedules" className="sidebar-link">
        <div className="sidebar-icon">
          <FaCalendarAlt />
        </div>
        <span className="w-8/12">Schedule</span>
      </Link>
    </div>
  );
}
