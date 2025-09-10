import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SubmitButton from "../components/buttons/SubmitButton";
import medtalkDarkLogo from "../assets/medtalk-dark-logo.png";

export default function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    document.title = "Reset Password | MedTalk";
  }, []);

  const [password, setPassword] = useState("");
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
    <div className="h-screen w-full flex justify-center items-center">
      <div className="p-6 flex justify-center items-center dark:bg-gray-800/50 border border-gray-700 rounded-4xl">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={medtalkDarkLogo} alt="medtalk logo" className="size-44 lg:size-96 self-center" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="h-full px-10 flex flex-col justify-center gap-5 ">
            <h1 className="text-4xl font-bold mb-auto self-center">Reset Password</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="pl-1">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="pl-1">Confirm Password</label>
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
            </div>
            <div className="flex justify-center items-center dark:text-delete-dark/90 text-sm">
              {message}
            </div>
            <SubmitButton isLoading={isLoading}>Reset password</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}


