import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaPills, FaCalendarAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar bg-light-800/5 dark:bg-dark-800/50 text-light-text dark:text-dark-text border-r dark:border-[#ffffff1a] border-dark/20">
      <Link to="/" className="sidebar-link hover:bg-800 dark:hover:bg-dark-800">
        <div className="sidebar-icon">
          <MdDashboard size="1.2rem" />
        </div>
        <span className="w-8/12">Dashboard</span>
      </Link>
      <Link to="/users" className="sidebar-link hover:bg-800 dark:hover:bg-dark-800">
        <div className="sidebar-icon">
          <FaUser size="1.2rem"/>
        </div>
        <span className="w-8/12">Users</span>
      </Link>
      <Link to="/medicine" className="sidebar-link hover:bg-800 dark:hover:bg-dark-800">
        <div className="sidebar-icon">
          <FaPills size="1.2rem"/>
        </div>
        <span className="w-8/12">Medicine</span>
      </Link>
      <Link to="/schedules" className="sidebar-link hover:bg-800 dark:hover:bg-dark-800">
        <div className="sidebar-icon">
          <FaCalendarAlt size="1.2rem"/>
        </div>
        <span className="w-8/12">Schedule</span>
      </Link>
    </div>
  );
}
