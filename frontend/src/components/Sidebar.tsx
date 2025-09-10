import { Link, useNavigate } from "react-router-dom";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaUser, FaPills, FaCalendarAlt, FaUserEdit, FaKey } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import UserInfo from "./UserInfo";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="sidebar bg-gray-700/40 ">
      <UserInfo />
      <hr className="w-3/4 mx-auto my-4 "/>
      {(user?.role === "super admin" || user?.role === "doctor") &&
        <Link to="/" className="sidebar-link hover:bg-primary-800/20 hover:text-dark-text dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon">
            <MdDashboard size="1.2rem" />
          </div>
          <span className="sidebar-label">Dashboard</span>
        </Link>
      }
      {(user?.role === "admin" || user?.role === "super admin") &&
        <Link to="/logs" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon">
            <FaUser size="1.2rem" />
          </div>
          <span className="sidebar-label">System Logs</span>
        </Link>
      }
      {(user?.role === "admin" || user?.role === "super admin") &&
        <Link to="/users" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon">
            <FaUser size="1.2rem" />
          </div>
          <span className="sidebar-label">Users</span>
        </Link>
      }
      {user?.role === "super admin" &&
        <Link to="/admins" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon">
            <FaUserEdit size="1.5rem" />
          </div>
          <span className="sidebar-label">Admins</span>
        </Link>
      }
      {(user?.role === "doctor" || user?.role === "super admin") && (
        <>
          <Link to="/medicine" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
            <div className="sidebar-icon">
              <FaPills size="1.2rem" />
            </div>
            <span className="sidebar-label">Medicines</span>
          </Link>
          <Link to="/schedules" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
            <div className="sidebar-icon">
              <FaCalendarAlt size="1.2rem" />
            </div>
            <span className="sidebar-label">Schedules</span>
          </Link>
        </>
      )}
      <Link to="/account" className="sidebar-link hover:bg-800 dark:hover:bg-primary-dark/50">
        <div className="sidebar-icon">
          <FaKey size="1.2rem" />
        </div>
        <span className="sidebar-label">Account</span>
      </Link>
      <div
        className="sidebar-link mt-auto mb-5 hover:bg-800 dark:hover:bg-primary-dark/50 cursor-pointer"
        onClick={async () => {
          try {
            const response = await fetch("/api/auth/logout", {
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
