import { useState, useEffect, type MouseEventHandler } from "react";
import medtalkDarkLogo from "../assets/medtalk-dark-logo.png";
import { useNavigate } from "react-router-dom";
// import medtalkLightLogo from "../assets/medtalk-light-logo.png";

export default function LoginRoute() {
  useEffect(() => {
    document.title = "Log In | MedTalk";
  }, []);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      console.log("provide all fields");
      return;
    }
    try {
      const body = JSON.stringify(credentials);
      const response = await fetch("/api/users/login",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
          credentials: "include",
        });

      // const data = await response.json();
      // console.log("login data value: ", data);
      
      // console.log("response status code:", response.status);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      console.error(`Error executing login function: ${err}`);
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="p-6 flex justify-center items-center dark:bg-gray-800/50 border border-gray-700 rounded-4xl">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={medtalkDarkLogo}
            alt="medtalk logo"
            className="size-44 lg:size-96 self-center"
          />
        </div>

        <div className="h-full px-10 flex flex-col justify-center gap-5 ">
          <h1 className="text-5xl font-bold mb-auto self-center"> Admin Portal</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="pl-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="modal-input"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="pl-1">Password</label>
            <input
              type="password"
              name="password"
              className="modal-input"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="self-center w-fit py-3 px-16 text-center cursor-pointer border rounded-4xl 
            dark:border-primary-dark/50 dark:hover:bg-primary-dark/70
            "
            onClick={handleLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
