import "./Navbar.css";

function Navbar({
  title,
  setTitle,
  language,
  setLanguage,
  saveCode,
  updateCode,
  createNewCode,
  runCode,
  isRunning,
  theme,
  toggleTheme,
}) {

  // =====================================================
  // GET USERNAME
  // =====================================================

  const username =
    localStorage.getItem("username") || "User";


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    // Remove JWT token
    localStorage.removeItem("token");

    // Remove user information
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");

    // Redirect to login page
    window.location.replace("/login");
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <nav className="navbar">


      {/* =================================================
          LEFT - LOGO
      ================================================= */}

      <div className="navbar-left">

        <h2>
          Online Code Editor
        </h2>

      </div>


      {/* =================================================
          CENTER - TITLE + LANGUAGE
      ================================================= */}

      <div className="navbar-center">

        {/* CODE TITLE */}

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="title-input"
          placeholder="Code Title"
        />


        {/* LANGUAGE */}

        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
          className="language-select"
        >

          <option value="javascript">
            JavaScript
          </option>

          <option value="python">
            Python
          </option>

          <option value="c">
            C
          </option>

          <option value="cpp">
            C++
          </option>

          <option value="java">
            Java
          </option>

          <option value="html">
            HTML
          </option>

          <option value="css">
            CSS
          </option>

        </select>

      </div>


      {/* =================================================
          RIGHT - ACTION BUTTONS
      ================================================= */}

      <div className="navbar-actions">


        {/* =================================================
            RUN
        ================================================= */}

        <button
          className="run-btn"
          onClick={runCode}
          disabled={isRunning}
        >

          {isRunning
            ? "⏳ Running..."
            : "▶ Run"}

        </button>


        {/* =================================================
            SAVE
        ================================================= */}

        <button
          onClick={saveCode}
        >
          💾 Save
        </button>


        {/* =================================================
            UPDATE
        ================================================= */}

        <button
          onClick={updateCode}
        >
          ✏️ Update
        </button>


        {/* =================================================
            NEW
        ================================================= */}

        <button
          onClick={createNewCode}
        >
          ➕ New
        </button>


        {/* =================================================
            THEME
        ================================================= */}

        <button
          className="theme-btn"
          onClick={toggleTheme}
          title="Change Theme"
        >

          {theme === "dark"
            ? "☀️"
            : "🌙"}

        </button>


        {/* =================================================
            USER + LOGOUT
        ================================================= */}

        <div className="logout-section">


          {/* USERNAME */}

          <span className="username">
            👤 {username}
          </span>


          {/* LOGOUT BUTTON */}

          <button
            className="logout-btn"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </nav>

  );
}

export default Navbar;