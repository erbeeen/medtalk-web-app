import { useEffect, useState, type FormEvent } from "react";
import SubmitButton from "../components/buttons/SubmitButton";
import medtalkLogo from "../assets/light-logo-with-name.svg"
import medtalkDarkLogo from "../assets/dark-logo-with-name.svg";
import userPrefersDarkMode from "../contexts/DarkModeContext";

export default function ForgotPasswordRoute() {
  useEffect(() => {
    document.title = "Forgot Password | MedTalk";
  }, []);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isDarkMode = userPrefersDarkMode();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await response.json().catch(() => null);
      setMessage("If an account exists for this email, a reset link was sent.");
    } catch {
      setMessage("If an account exists for this email, a reset link was sent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="p-6 flex justify-center items-center rounded-4xl">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={!isDarkMode ? medtalkLogo : medtalkDarkLogo} alt="medtalk logo" className="size-44 lg:size-96 self-center" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="h-full px-10 flex flex-col justify-center gap-5 ">
            <h1 className="text-4xl font-bold mb-auto self-center">Forgot Password</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="pl-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="modal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center items-center text-delete text-sm">
              {message}
            </div>
            <SubmitButton isLoading={isLoading}>Send reset link</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}


