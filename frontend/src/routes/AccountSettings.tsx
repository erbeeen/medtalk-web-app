import { useEffect, useState, type FormEvent } from "react";
import SubmitButton from "../components/buttons/SubmitButton";

export default function AccountSettingsRoute() {
  useEffect(() => {
    document.title = "Account Settings | MedTalk";
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
      const response = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!result.success) {
        setMessage("Failed to change password.");
        setIsLoading(false);
        return;
      }
      setMessage("Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-start">
      <form onSubmit={handleSubmit} className="max-w-lg w-full">
        <div className="h-full px-10 flex flex-col justify-center gap-5 ">
          <h1 className="text-3xl font-bold mb-2">Change Password</h1>
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
          <div className="flex justify-center items-center dark:text-delete-dark/90 text-sm min-h-5">
            {message}
          </div>
          <SubmitButton isLoading={isLoading}>Update password</SubmitButton>
        </div>
      </form>
    </div>
  );
}


