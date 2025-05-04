import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav id="navbar">
      <div className="user-info flex-column nowrap align-center">
        <div className="profile-pic" />
        <h3>Username</h3>
        <h4>Role</h4>
      </div>
      <ul id="navbar-links" className="p-0 flex-column nowrap align-center">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/medicine">Medicine</Link></li>
        <li><Link to="/schedules">Schedules</Link></li>
      </ul>
    </nav>
  );
}
