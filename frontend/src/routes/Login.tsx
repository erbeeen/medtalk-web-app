import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) {
      console.log("provide all fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/users/login",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

      const data = await response.json();
      console.log("response status code:", response.status);
      console.log("finished decoding data json: ", data);
      if (data.success) {
        navigate("/about");
      }
    } catch (err) {
      console.error(`Error executing login function: ${err}`);
    }
  }

return (
  <div>
    <h1>Login</h1>
    <form>
      <input
        type="text"
        name="username"
        placeholder="username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="text"
        name="password"
        placeholder="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit" onClick={handleLogin}>login</button>
    </form>
  </div>
);
}
