import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { IoPersonCircle } from "react-icons/io5";


export default function UserInfo() {
  const { user } = useUser();

  // TODO: Not lining up with the rest of the
  // sidebar icons
  return (
    <>
      <div className="w-full flex flex-row justify-center items-center invisible">
        <div className="sidebar-icon">
          <IoPersonCircle size="1.5rem" />
        </div>
        <div className="w-8/12 flex flex-col">
          <p>{user?.username}</p>
          <h3>{user?.role}</h3>
          <Link to={"/profile"}>
            <span className="underline">profile</span>
          </Link>

        </div>
      </div>
    </>
  );
}
