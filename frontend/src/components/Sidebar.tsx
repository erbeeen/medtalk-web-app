import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaUser, FaPills, FaUserEdit, FaFileAlt } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import UserInfo from "./UserInfo";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="sidebar dark:bg-[#053143] ">
      <UserInfo />
      <hr className="w-3/4 mx-auto my-4 text-gray-300" />
      {(user?.role === "super admin" || user?.role === "doctor") &&
        <Link to="/" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon text-current">
            <MdDashboard size="1.2rem" />
          </div>
          <span className="sidebar-label text-current">Dashboard</span>
        </Link>
      }
      {(user?.role === "admin" || user?.role === "super admin") &&
        <Link to="/logs" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon text-current">
            <FaFileAlt size="1.2rem" />
          </div>
          <span className="sidebar-label text-current">System Logs</span>
        </Link>
      }
      {(user?.role === "admin" || user?.role === "super admin") &&
        <Link to="/users" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon text-current">
            <FaUser size="1.2rem" />
          </div>
          <span className="sidebar-label text-current">Users</span>
        </Link>
      }
      {user?.role === "super admin" &&
        <Link to="/admins" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
          <div className="sidebar-icon text-current">
            <FaUserEdit size="1.5rem" />
          </div>
          <span className="sidebar-label text-current">Admins</span>
        </Link>
      }
      {(user?.role === "doctor" || user?.role === "super admin") && (
        <>
          <Link to="/medicine" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
            <div className="sidebar-icon text-current">
              <FaPills size="1.2rem" />
            </div>
            <span className="sidebar-label text-current">Medicines</span>
          </Link>

          <Link to="/schedules" className="sidebar-link hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50">
            <div className="sidebar-icon text-current">
              <FaCalendarAlt size="1.2rem" />
            </div>
            <span className="sidebar-label text-current">Schedules</span>
          </Link>
        </>
      )}

      {user && (
        <div
          className="sidebar-link mt-auto mb-5 hover:bg-gray-200 hover:text-black dark:hover:bg-primary-dark/50 cursor-pointer"
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
          <div className="sidebar-icon text-current">
            <MdLogout size="1.2rem" />
          </div>
          <span className="w-8/12 sidebar-label text-current">Logout</span>
        </div>

      )}
    </div>
  );
}
