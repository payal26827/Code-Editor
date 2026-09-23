import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: username.trim(),
          email: email.trim(),
          password: password,
        }
      );

      console.log("Register Response:", response.data);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Clear fields
      setUsername("");
      setEmail("");
      setPassword("");

      // Go to login after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Register Error:", error);

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
        {/* Heading */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "30px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#aaa",
            marginBottom: "25px",
            fontSize: "15px",
          }}
        >
          Join Online Code Editor
        </p>

        {/* Error */}

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

        {/* Success */}

        {success && (
          <div
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "18px",
              background: "#166534",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* Username */}

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
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
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

          {/* Email */}

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

          {/* Password */}

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
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
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

          {/* Register Button */}

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
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        {/* Login Link */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#aaa",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#22c55e",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;