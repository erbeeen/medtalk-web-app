import { Link, useNavigate } from "react-router-dom";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaUser, FaPills, FaCalendarAlt, FaUserEdit } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-gray-700/40 ">
      <Link to="/" className="sidebar-link hover:bg-primary-800/20 hover:text-dark-text dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <MdDashboard size="1.2rem" />
        </div>
        <span className="w-8/12 sidebar-label">Dashboard</span>
      </Link>
      <Link to="/users" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <FaUser size="1.2rem" />
        </div>
        <span className="w-8/12 sidebar-label">Users</span>
      </Link>
      <Link to="/admins" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <FaUserEdit size="1.5rem" />
        </div>
        <span className="w-8/12 sidebar-label">Admins</span>
      </Link>
      <Link to="/medicine" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <FaPills size="1.2rem" />
        </div>
        <span className="w-8/12 sidebar-label">Medicines</span>
      </Link>
      <Link to="/schedules" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <FaCalendarAlt size="1.2rem" />
        </div>
        <span className="w-8/12 sidebar-label">Schedules</span>
      </Link>
      <div
        className="sidebar-link mt-auto mb-5 hover:bg-800 dark:hover:bg-primary-dark/50 cursor-pointer"
        onClick={async () => {
          try {
            const response = await fetch("/api/users/logout", {
              mode: "cors",
              method: "POST",
              credentials: "include",
            });

            if (response.status === 200) {
              navigate("/login");
            }
          } catch (err) {
            console.error("error while logging out: ", err);
          }
        }}
      >
        <div className="sidebar-icon">
          <MdLogout size="1.2rem" />
        </div>
        <span className="w-8/12 sidebar-label">Logout</span>
      </div>
    </div>
  );
}
