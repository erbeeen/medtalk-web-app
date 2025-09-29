import { useEffect, useState, type FormEvent } from "react";
import SubmitButton from "../components/buttons/SubmitButton";
import { useUser } from "../contexts/UserContext";
import { FaUserCircle } from "react-icons/fa";

type UserProfile = {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  username?: string | undefined;
}

export default function AccountSettingsRoute() {
  useEffect(() => {
    document.title = "Account Settings | MedTalk";
  }, []);

  const { user, setUser } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const [isUpdatePasswordLoading, setIsUpdatePasswordLoading] = useState(false);
  const [updateProfileMessage, setUpdateProfileMessage] = useState<string | null>(null);
  const [updatePasswordMessage, setUpdatePasswordMessage] = useState<string | null>(null);
  const [referenceProfile, setReferenceProfile] = useState<UserProfile>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/?id=${user.id}`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });
        if (res.status === 200) {
          const result = await res.json();

          setReferenceProfile({
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            username: result.data.username,
          });
          setFirstName(result.data.firstName ?? "");
          setLastName(result.data.lastName ?? "");
          setEmail(result.data.email ?? "");
          setUsername(result.data.username ?? "");
        }
      } catch {
        // no-op
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    console.log('update profile called');
    
    e.preventDefault();
    if (!user?.id) return;
    setIsUpdateProfileLoading(true);
    setUpdateProfileMessage(null);

    const payload: any = {};
    try {
      if (referenceProfile.firstName !== firstName) {
        payload.firstName = firstName;
      }
      if (referenceProfile.lastName !== lastName) {
        payload.lastName = lastName;
      }
      if (referenceProfile.email !== email) {
        payload.email = email;
      }
      if (referenceProfile.username !== username) {
        payload.username = username;
      }
      const body = JSON.stringify(payload);

      const response = await fetch(`/api/users/update/?id=${user.id}`, {
        mode: "cors",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      const result = await response.json();
      console.log('result:');
      console.log(result);
      if (!result.success) {
        setUpdateProfileMessage("Failed to update profile.");
      } else {
        setUpdateProfileMessage("Profile updated successfully.");
        setReferenceProfile({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          username: result.data.username,
        });
        setFirstName(result.data.firstName ?? "");
        setLastName(result.data.lastName ?? "");
        setEmail(result.data.email ?? "");
        setUsername(result.data.username ?? "");
        setUser({id: result.data._id, username: result.data.username, role: result.data.role});
      }
    } catch {
      setUpdateProfileMessage("Server error. Try again later.");
    } finally {
      setIsUpdateProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setUpdatePasswordMessage("Passwords do not match");
      return;
    }
    setIsUpdatePasswordLoading(true);
    setUpdateProfileMessage(null);
    try {
      const response = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!result.success) {
        setUpdatePasswordMessage(result.data);
        setIsUpdateProfileLoading(false);
        return;
      }
      setUpdatePasswordMessage("Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setUpdatePasswordMessage("Server error. Try again later.");
    } finally {
      setIsUpdatePasswordLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 rounded-xl p-8 ">
        <div className="w-full flex flex-col items-center gap-3 text-center">
          <FaUserCircle className="text-gray-500 dark:text-gray-300" size={120} />
          <h1 className="text-2xl md:text-3xl font-semibold">Welcome{user?.username ? `, ${user.username}` : ""}</h1>
          <p className="text-sm md:text-base text-light-text/70 dark:text-dark-text/70">
            Manage your profile here.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleUpdateProfile} className="w-full">
            <div className="h-full px-6 md:px-10 py-6 flex flex-col justify-center gap-5 bg-gray-200 dark:bg-gray-700/30 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="firstName" className="pl-1">First Name</label>
                  <input id="firstName" className="modal-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="lastName" className="pl-1">Last Name</label>
                  <input id="lastName" className="modal-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="pl-1">Email Address</label>
                <input id="email" type="email" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="pl-1">Username</label>
                <input id="username" className="modal-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="flex justify-center items-center dark:text-delete-dark/90 text-sm min-h-5">
                {updateProfileMessage}
              </div>
              <SubmitButton isLoading={isUpdateProfileLoading}>Update</SubmitButton>
            </div>
          </form>

          <form onSubmit={handleUpdatePassword} className="w-full">
            <div className="h-full px-6 md:px-10 py-6 flex flex-col justify-center gap-5 bg-gray-200 dark:bg-gray-700/30 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Change Password</h2>
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
                {updatePasswordMessage}
              </div>
              <SubmitButton isLoading={isUpdatePasswordLoading}>Update password</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


