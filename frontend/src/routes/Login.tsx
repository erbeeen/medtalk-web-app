import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SubmitButton from "../components/buttons/SubmitButton";
import medtalkDarkLogo from "../assets/medtalk-dark-logo.png";

export default function LoginRoute() {
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

      const result = await response.json();

      if (!result.success) {
        setErrMessage(`*${result.data}`);
        setIsLoading(false);
        return;
      }

      setUser({username: result.data.username, role: result.data.role});
      navigate("/");
    } catch (err) {
      console.error(`Error executing login function: ${err}`);
      setErrMessage("Server error. Try again later.")
      setIsLoading(false);
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

            <div className="flex justify-center items-center dark:text-delete-dark/90">
              {errMessage}
            </div>

            <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
            <div className="text-sm text-center mt-2">
              <button
                type="button"
                className="underline hover:opacity-80 cursor-pointer"
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
