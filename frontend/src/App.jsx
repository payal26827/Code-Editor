import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "./components/Navbar.jsx";

import Sidebar from "./components/Sidebar.jsx";

import Editor from "./components/Editor.jsx";

import "./App.css";

// =====================================================
// API URLS
// =====================================================

const RUN_API_URL =
  "http://localhost:5000/api/run";

const CODES_API_URL =
  "http://localhost:5000/api/codes";

// =====================================================
// AUTH CONFIG
// =====================================================

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// CHECK LOGIN
// =====================================================

const checkLogin = () => {
  const token =
    localStorage.getItem("token");

  return Boolean(token);
};

// =====================================================
// DEFAULT JAVA CODE
// =====================================================

const DEFAULT_JAVA_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;

// =====================================================
// DEFAULT HTML CODE
// =====================================================

const DEFAULT_HTML_CODE = `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`;

// =====================================================
// APP
// =====================================================

function App() {
  // ===================================================
  // AUTH CHECK
  // ===================================================

  const [isAuthenticated, setIsAuthenticated] =
    useState(checkLogin());

  // ===================================================
  // TITLE
  // ===================================================

  const [title, setTitle] =
    useState("My Code");

  // ===================================================
  // LANGUAGE
  // ===================================================

  const [language, setLanguage] =
    useState("java");

  // ===================================================
  // MAIN CODE
  // ===================================================

  const [code, setCode] =
    useState(DEFAULT_JAVA_CODE);

  // ===================================================
  // HTML CODE
  // ===================================================

  const [htmlCode, setHtmlCode] =
    useState(DEFAULT_HTML_CODE);

  // ===================================================
  // THEME
  // ===================================================

  const [theme, setTheme] =
    useState("dark");

  // ===================================================
  // OUTPUT
  // ===================================================

  const [output, setOutput] =
    useState("");

  // ===================================================
  // RUNNING
  // ===================================================

  const [isRunning, setIsRunning] =
    useState(false);

  // ===================================================
  // SAVED CODES
  // ===================================================

  const [codes, setCodes] =
    useState([]);

  // ===================================================
  // SELECTED CODE
  // ===================================================

  const [selectedId, setSelectedId] =
    useState(null);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    setIsAuthenticated(true);
  }, []);

  // =====================================================
  // LOAD SAVED CODES
  // =====================================================

  const fetchCodes = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setCodes([]);
        return;
      }

      const response =
        await axios.get(
          CODES_API_URL,
          getAuthConfig()
        );

      console.log(
        "Fetched Codes:",
        response.data
      );

      // RESPONSE ARRAY
      if (
        Array.isArray(response.data)
      ) {
        setCodes(response.data);
      }

      // RESPONSE { codes: [] }
      else if (
        Array.isArray(
          response.data.codes
        )
      ) {
        setCodes(
          response.data.codes
        );
      }

      // RESPONSE { data: [] }
      else if (
        Array.isArray(
          response.data.data
        )
      ) {
        setCodes(
          response.data.data
        );
      }

      // OTHERWISE
      else {
        setCodes([]);
      }
    } catch (error) {
      console.error(
        "Fetch Codes Error:",
        error
      );

      // If token expired/invalid
      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "username"
        );

        window.location.replace(
          "/login"
        );

        return;
      }

      setCodes([]);
    }
  };

  // =====================================================
  // LOAD CODES WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    if (isAuthenticated) {
      fetchCodes();
    }
  }, [isAuthenticated]);

  // =====================================================
  // RUN CODE
  // =====================================================

  const runCode = async () => {
    try {
      setIsRunning(true);

      setOutput(
        "Running..."
      );

      // =================================================
      // HTML
      // =================================================

      if (
        language === "html"
      ) {
        setOutput(code);
        return;
      }

      // =================================================
      // CSS
      // =================================================

      if (
        language === "css"
      ) {
        const cssOutput = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>
<style>
${code}
</style>
</head>
<body>
${htmlCode}
</body>
</html>
`;

        setOutput(
          cssOutput
        );

        return;
      }

      // =================================================
      // INPUT REQUIREMENT
      // =================================================

      let needsInput = false;

      // JAVA
      if (
        language === "java"
      ) {
        if (
          /Scanner\s*\(/.test(code) ||
          /System\.in/.test(code) ||
          /\.nextInt\s*\(/.test(code) ||
          /\.next\s*\(/.test(code) ||
          /\.nextLine\s*\(/.test(code) ||
          /\.nextDouble\s*\(/.test(code) ||
          /\.nextFloat\s*\(/.test(code) ||
          /\.nextLong\s*\(/.test(code) ||
          /BufferedReader/.test(code) ||
          /\.readLine\s*\(/.test(code)
        ) {
          needsInput = true;
        }
      }

      // C
      if (
        language === "c"
      ) {
        if (
          /scanf\s*\(/.test(code) ||
          /getchar\s*\(/.test(code) ||
          /gets\s*\(/.test(code)
        ) {
          needsInput = true;
        }
      }

      // C++
      if (
        language === "cpp"
      ) {
        if (
          /cin\s*>>/.test(code) ||
          /getline\s*\(/.test(code)
        ) {
          needsInput = true;
        }
      }

      // PYTHON
      if (
        language === "python"
      ) {
        if (
          /\binput\s*\(/.test(code) ||
          /sys\.stdin/.test(code)
        ) {
          needsInput = true;
        }
      }

      // JAVASCRIPT
      if (
        language === "javascript"
      ) {
        if (
          /readline/.test(code) ||
          /process\.stdin/.test(code)
        ) {
          needsInput = true;
        }
      }

      // =================================================
      // GET PROGRAM PROMPT
      // =================================================

      const getInputPrompt = (
        language,
        code
      ) => {
        let match = null;

        // JAVA
        if (
          language === "java"
        ) {
          match = code.match(
            /System\.out\.print(?:ln)?\s*\(\s*"([^"]*)"\s*\)/
          );
        }

        // C
        else if (
          language === "c"
        ) {
          match = code.match(
            /printf\s*\(\s*"([^"]*)"/
          );
        }

        // C++
        else if (
          language === "cpp"
        ) {
          match = code.match(
            /cout\s*<<\s*"([^"]*)"/
          );
        }

        // PYTHON
        else if (
          language === "python"
        ) {
          match = code.match(
            /input\s*\(\s*"([^"]*)"\s*\)/
          );
        }

        // JAVASCRIPT
        else if (
          language === "javascript"
        ) {
          match =
            code.match(
              /\.question\s*\(\s*"([^"]*)"/
            ) ||
            code.match(
              /console\.log\s*\(\s*"([^"]*)"\s*\)/
            );
        }

        return match?.[1] || "";
      };

      // =================================================
      // INPUT
      // =================================================

      let stdin = "";

      let detectedPrompt = "";

      if (needsInput) {
        let inputPrompt =
          "Enter input for your program:";

        detectedPrompt =
          getInputPrompt(
            language,
            code
          );

        if (detectedPrompt) {
          inputPrompt =
            detectedPrompt;
        }

        const userInput =
          window.prompt(
            inputPrompt
          );

        if (
          userInput !== null
        ) {
          stdin = userInput;
        }
      }

      // =================================================
      // SEND CODE TO BACKEND
      // =================================================

      const response =
        await axios.post(
          RUN_API_URL,
          {
            language: language,
            code: code,
            stdin: stdin,
          }
        );

      console.log(
        "Run Response:",
        response.data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (
  response.data.success
) {
  let programOutput =
    response.data.output || "";

  if (detectedPrompt) {
    const promptRegex =
      new RegExp(
        detectedPrompt.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "g"
      );

    programOutput =
      programOutput.replace(
        promptRegex,
        ""
      );
  }

  setOutput(
    programOutput.trimStart() ||
    "Program executed successfully."
  );
}

      // =================================================
      // ERROR
      // =================================================

      else {
        setOutput(
          response.data.error ||
          response.data.message ||
          "Code execution failed."
        );
      }
    } catch (error) {
      console.error(
        "Run Code Error:",
        error
      );

      setOutput(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Cannot connect to backend."
      );
    } finally {
      setIsRunning(false);
    }
  };

  // =====================================================
  // SAVE CODE
  // =====================================================

  const saveCode = async () => {
    try {
      if (!title.trim()) {
        alert(
          "Please enter code title."
        );

        return;
      }

      if (!code.trim()) {
        alert(
          "Please enter some code."
        );

        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login first."
        );

        window.location.replace(
          "/login"
        );

        return;
      }

      const response =
        await axios.post(
          CODES_API_URL,
          {
            title: title.trim(),
            language: language,
            code: code,
            htmlCode: htmlCode,
          },
          getAuthConfig()
        );

      console.log(
        "Save Response:",
        response.data
      );

      const newCode =
        response.data.data;

      if (newCode) {
        setCodes(
          (previousCodes) => [
            newCode,
            ...previousCodes,
          ]
        );

        setSelectedId(
          newCode._id
        );
      }

      alert(
        "Code saved successfully!"
      );
    } catch (error) {
      console.error(
        "Save Code Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "username"
        );

        window.location.replace(
          "/login"
        );

        return;
      }

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save code."
      );
    }
  };

  // =====================================================
  // UPDATE CODE
  // =====================================================

  const updateCode = async () => {
    try {
      if (!selectedId) {
        alert(
          "Please select a saved code first."
        );

        return;
      }

      if (!title.trim()) {
        alert(
          "Please enter code title."
        );

        return;
      }

      const response =
        await axios.put(
          `${CODES_API_URL}/${selectedId}`,
          {
            title: title.trim(),
            language: language,
            code: code,
            htmlCode: htmlCode,
          },
          getAuthConfig()
        );

      console.log(
        "Update Response:",
        response.data
      );

      const updatedCode =
        response.data.data;

      if (updatedCode) {
        setCodes(
          (previousCodes) =>
            previousCodes.map(
              (item) =>
                item._id ===
                updatedCode._id
                  ? updatedCode
                  : item
            )
        );
      }

      alert(
        "Code updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update Code Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "username"
        );

        window.location.replace(
          "/login"
        );

        return;
      }

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update code."
      );
    }
  };

  // =====================================================
  // CREATE NEW CODE
  // =====================================================

  const createNewCode = () => {
    setSelectedId(null);

    setTitle(
      "Untitled Code"
    );

    setLanguage(
      "javascript"
    );

    setCode("");

    setHtmlCode("");

    setOutput("");
  };

  // =====================================================
  // SELECT SAVED CODE
  // =====================================================

  const selectCode = (item) => {
    console.log(
      "Selected Code:",
      item
    );

    setSelectedId(
      item._id
    );

    setTitle(
      item.title ||
      "My Code"
    );

    setLanguage(
      item.language ||
      "java"
    );

    setCode(
      item.code ||
      ""
    );

    setHtmlCode(
      item.htmlCode ||
      DEFAULT_HTML_CODE
    );

    setOutput("");
  };

  // =====================================================
  // DELETE CODE
  // =====================================================

  const deleteCode = async (id) => {
    try {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this code?"
        );

      if (!confirmDelete) {
        return;
      }

      await axios.delete(
        `${CODES_API_URL}/${id}`,
        getAuthConfig()
      );

      console.log(
        "Deleted Code:",
        id
      );

      setCodes(
        (previousCodes) =>
          previousCodes.filter(
            (item) =>
              item._id !== id
          )
      );

      if (
        selectedId === id
      ) {
        createNewCode();
      }

      alert(
        "Code deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete Code Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "username"
        );

        window.location.replace(
          "/login"
        );

        return;
      }

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete code."
      );
    }
  };

  // =====================================================
  // TOGGLE THEME
  // =====================================================

  const toggleTheme = () => {
    setTheme(
      (previousTheme) =>
        previousTheme === "dark"
          ? "light"
          : "dark"
    );
  };

  // =====================================================
  // WAIT FOR AUTH CHECK
  // =====================================================

  if (!isAuthenticated) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className={`app ${
        theme === "dark"
          ? "dark"
          : "light"
      }`}
    >
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        title={title}
        setTitle={setTitle}
        language={language}
        setLanguage={setLanguage}
        saveCode={saveCode}
        updateCode={updateCode}
        createNewCode={createNewCode}
        runCode={runCode}
        isRunning={isRunning}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="main-container">

        {/* SIDEBAR */}

        <Sidebar
          codes={codes}
          selectCode={selectCode}
          deleteCode={deleteCode}
          selectedId={selectedId}
        />

        {/* EDITOR + OUTPUT */}

        <div className="editor-output-container">

          {/* EDITOR */}

          <Editor
            code={code}
            setCode={setCode}
            language={language}
            theme={theme}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
          />

          {/* OUTPUT */}

          <div className="output-container">

            <h3>
              Output
            </h3>

            {/* HTML / CSS */}

            {(
              language === "html" ||
              language === "css"
            ) ? (
              <iframe
                title="Code Output"
                srcDoc={
                  language === "html"
                    ? code
                    : output
                }
                className="output-frame"
                sandbox="allow-scripts"
              />
            ) : (

              /* JAVA / C / C++ / PYTHON / JAVASCRIPT */

              <pre className="output-console">
                {output ||
                  "Click ▶ Run to execute your code"}
              </pre>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;