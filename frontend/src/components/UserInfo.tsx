import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { IoPersonCircle } from "react-icons/io5";
import { useEffect } from "react";


export default function UserInfo() {
  const { user } = useUser();
  let role = `${user?.role[0].toUpperCase()}${user?.role.substring(1)}`;
  if (user?.role === "super admin") {
    role = "Super Admin";
  }

  useEffect(() => {
    role = `${user?.role[0].toUpperCase()}${user?.role.substring(1)}`;
    if (user?.role === "super admin") {
      role = "Super Admin";
    }
  }, [user]);

  return (
    <>
      <div className="w-full flex flex-row justify-center items-center">
        <Link to={"/account"}>
          <div className="px-3">
            <IoPersonCircle size="3rem" />
          </div>
        </Link>
        <div className="w-8/12 hidden md:flex lg:flex xl:flex flex-col">
          <h1 className="mb-0.5 font-medium">{user?.username}</h1>
          <div className="flex flex-row text-[11px]">
            <h3>{role}</h3>
            <span className="px-0.5">|</span>
            <Link to={"/account"}>
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
