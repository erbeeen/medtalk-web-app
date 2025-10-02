import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SubmitButton from "../components/buttons/SubmitButton";
import medTalkLogo from "../assets/light-logo-with-name.svg";
import medtalkDarkLogo from "../assets/dark-logo-with-name.svg";
import userPrefersDarkMode from "../contexts/DarkModeContext";

export default function LoginRoute() {
  const isDarkMode = userPrefersDarkMode();
  useEffect(() => {
    document.title = "Log In | MedTalk";
  }, []);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrMessage("");
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setErrMessage("*Provide all fields.");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(credentials.email)) {
      setErrMessage("*Invalid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const body = JSON.stringify(credentials);
      const response = await fetch("/api/users/admin/login",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
          credentials: "include",
        });

      if (response.status === 400 || response.status === 401) {
        const errResult = await response.json();
        setErrMessage(`*${errResult.data}`);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (!result.success) {
        setErrMessage(`*${result.data}`);
        setIsLoading(false);
        return;
      }

      setUser({id: result.data.id, username: result.data.username, role: result.data.role});
      
      // Redirect based on user role
      switch (result.data.role) {
        case "super admin":
        case "doctor":
          navigate("/"); // Dashboard
          break;
        case "admin":
          navigate("/users"); // Users management
          break;
        case "user":
          navigate("/account"); // Profile page
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error(`Error executing login function: ${err}`);
      setErrMessage("Server error. Try again later.")
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {/* <div className="p-6 flex justify-center items-center dark:bg-gray-800/50 border border-gray-700 rounded-4xl"> */}
      <div className="p-6 flex justify-center items-center">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={`${!isDarkMode ? medTalkLogo : medtalkDarkLogo}`}
            alt="medtalk logo"
            className="size-44 lg:size-96 self-center object-contain"
          />
        </div>

        <form onSubmit={handleLogin}>
          <div className="h-full px-10 flex flex-col justify-center gap-5 ">
            <h1 className="text-5xl font-bold mb-auto self-center">Login</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="pl-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="modal-input"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
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
                required
              />
            </div>

            <div className="flex justify-center items-center text-delete">
              {errMessage}
            </div>

            <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
            <div className="text-sm text-center mt-2">
              <button
                type="button"
                className="underline decoration-1 hover:opacity-80 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
