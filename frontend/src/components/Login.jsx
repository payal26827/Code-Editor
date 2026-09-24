import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // LOGIN API
      // =================================================

     const response = await axios.post(
  "https://code-editor-zgzr.onrender.com/api/auth/login",
  {
    email: email.trim(),
    password: password,
  }
);

      console.log("Login Response:", response.data);

      // =================================================
      // GET USER DATA
      // =================================================

      const user = response.data.user;

      console.log("Logged-in User:", user);

      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!response.data.token) {
        setError("Login successful but token was not received.");
        return;
      }

      // =================================================
      // SAVE TOKEN
      // =================================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // =================================================
      // SAVE ACTUAL USER ID
      // =================================================

      if (user?.id) {
        localStorage.setItem(
          "userId",
          user.id
        );
      }

      // =================================================
      // SAVE USERNAME
      // =================================================

      const username =
        user?.username ||
        user?.name ||
        response.data.username ||
        response.data.name ||
        email.split("@")[0];

      localStorage.setItem(
        "username",
        username
      );

      // =================================================
      // SAVE EMAIL
      // =================================================

      localStorage.setItem(
        "userEmail",
        user?.email || email.trim()
      );

      // =================================================
      // CHECK SAVED DATA
      // =================================================

      console.log(
        "User ID:",
        localStorage.getItem("userId")
      );

      console.log(
        "Username:",
        localStorage.getItem("username")
      );

      console.log(
        "Email:",
        localStorage.getItem("userEmail")
      );

      // =================================================
      // GO TO CODE EDITOR
      // =================================================

      navigate("/");

    } catch (error) {
      console.error("Login Error:", error);

      // Remove old login data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1e1e1e",
        padding: "20px",
      }}
    >

      {/* =================================================
          LOGIN BOX
      ================================================= */}

      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          padding: "30px",
          background: "#2b2b2b",
          border: "1px solid #444",
          borderRadius: "10px",
          color: "white",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "30px",
          }}
        >
          Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#aaa",
            marginBottom: "25px",
            fontSize: "15px",
          }}
        >
          Welcome to Online Code Editor
        </p>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "18px",
              background: "#7f1d1d",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              style={{
                width: "100%",
                height: "45px",
                padding: "10px 12px",
                borderRadius: "5px",
                border: "1px solid #555",
                background: "#1f1f1f",
                color: "white",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              style={{
                width: "100%",
                height: "45px",
                padding: "10px 12px",
                borderRadius: "5px",
                border: "1px solid #555",
                background: "#1f1f1f",
                color: "white",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "45px",
              border: "none",
              borderRadius: "5px",
              background: "#22c55e",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =================================================
            REGISTER LINK
        ================================================= */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#aaa",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/register"
            style={{
              color: "#22c55e",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;