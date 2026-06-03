import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SubmitButton from "../components/buttons/SubmitButton";
import medTalkLogo from "../assets/light-logo-with-name.svg";
import medtalkDarkLogo from "../assets/dark-logo-with-name.svg";
import userPrefersDarkMode from "../contexts/DarkModeContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const isDarkMode = userPrefersDarkMode();

  useEffect(() => {
    document.title = "Reset Password | MedTalk";
  }, []);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!result.success) {
        setMessage("Invalid or expired reset link.");
        setIsLoading(false);
        return;
      }
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMessage("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full flex justify-center items-center`}>
      <div className="flex p-6 pb-10 flex-col lg:flex-row justify-center items-center gap-3 lg:gap-5">
        <div className="flex h-full mb-5 lg:mb-0 flex-col justify-center items-center">
          <img 
            src={`${!isDarkMode ? medTalkLogo : medtalkDarkLogo}`} 
            alt="medtalk logo" 
            className="size-44 lg:size-96 self-center object-contain" 
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="h-full min-w-[400px] px-10 flex flex-col justify-center gap-5 ">
            <h1 className="text-4xl font-bold mb-5">Reset Password</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="modal-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-2.5"
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaRegEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="pl-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="modal-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-2.5"
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaRegEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center text-delete text-sm">
              {message}
            </div>
            <SubmitButton isLoading={isLoading}>Reset password</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}


