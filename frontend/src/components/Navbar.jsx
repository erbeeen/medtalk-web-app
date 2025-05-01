import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div className="user-info flex-column nowrap align-center">
        <div className="profile-pic" />
        <div id="navusername">Irvin</div>
        <div id="navrole">Admin</div>
      </div>
      <hr />
      <ul id="navbar-links" className="p-0 flex-column nowrap align-center">
        <div className="navlink-container">
          <li><Link className="navlink" to="/">Dashboard</Link></li>
        </div>
        <div className="navlink-container">
          <li><Link className="navlink" to="/users">Users</Link></li>
        </div>
        <div className="navlink-container">
          <li><Link className="navlink" to="/medicine">Medicine</Link></li>
        </div>
        <div className="navlink-container">
          <li><Link className="navlink" to="/schedules">Schedules</Link></li>
        </div>
      </ul>
    </nav>
  );
}
