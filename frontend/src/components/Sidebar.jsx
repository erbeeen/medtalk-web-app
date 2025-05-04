import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen flex flex-col p-2 text-light text-sm font-light border border-white">
      <Link to="/">Dashboard</Link>
      <Link to="/users">Users</Link>
      <Link to="/medicine">Medicine</Link>
      <Link to="/schedules">Schedules</Link>
    </div>
  );
}
