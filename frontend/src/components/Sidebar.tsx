import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaPills, FaCalendarAlt, FaUserEdit } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar bg-primary-dark/30 dark:bg-gray-700/40 text-light-text dark:text-dark-text">
      <Link to="/" className="sidebar-link hover:bg-primary-800/30 hover:text-dark-text dark:hover:bg-primary-dark/20">
        <div className="sidebar-icon">
          <MdDashboard size="1.2rem" />
        </div>
        <span className="hidden lg:w-8/12 lg:block">Dashboard</span>
      </Link>
      <Link to="/users" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/20">
        <div className="sidebar-icon">
          <FaUser size="1.2rem"/>
        </div>
        <span className="w-8/12">Users</span>
      </Link>
      <Link to="/admins" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/20">
        <div className="sidebar-icon">
          <FaUserEdit size="1.5rem" />
        </div>
        <span className="w-8/12">Admins</span>
      </Link>
      <Link to="/medicine" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/20">
        <div className="sidebar-icon">
          <FaPills size="1.2rem"/>
        </div>
        <span className="w-8/12">Medicines</span>
      </Link>
      <Link to="/schedules" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/20">
        <div className="sidebar-icon">
          <FaCalendarAlt size="1.2rem"/>
        </div>
        <span className="w-8/12">Schedules</span>
      </Link>
    </div>
  );
}
