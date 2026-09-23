import Editor from "@monaco-editor/react";

function CodeEditor({
  code,
  setCode,
  language,
  theme,
  htmlCode,
  setHtmlCode,
}) {

  // ==================================================
  // DISPLAY LANGUAGE
  // ==================================================

  const displayLanguage = {
    javascript: "JavaScript",
    python: "Python",
    c: "C",
    cpp: "C++",
    java: "Java",
    html: "HTML",
    css: "CSS",
  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <main className="editor-container">


      {/* ============================================
          MAIN EDITOR HEADER
      ============================================ */}

      <div className="editor-header">

        <span>
          Language:{" "}
          {
            displayLanguage[language]
              || language
          }
        </span>

      </div>


      {/* ============================================
          MAIN CODE EDITOR
      ============================================ */}

      <div className="monaco-container">

        <Editor

          height="100%"
          width="100%"

          // IMPORTANT:
          // cpp backend/Monaco ke liye rahega
          // screen par C++ dikhega

          language={language}

          value={code}

          onChange={(value) => {

            setCode(
              value || ""
            );

          }}

          theme={
            theme === "light"
              ? "vs-light"
              : "vs-dark"
          }

          options={{

            fontSize: 18,

            minimap: {
              enabled: false,
            },

            automaticLayout: true,

            wordWrap: "on",

            padding: {
              top: 20,
              bottom: 20,
            },

            scrollBeyondLastLine:
              false,

            smoothScrolling: true,

            cursorBlinking:
              "smooth",

            renderWhitespace:
              "selection",
          }}

        />

      </div>


      {/* ============================================
          CSS SELECT KARNE PAR HTML EDITOR
      ============================================ */}

      {language === "css" && (

        <div className="html-side-editor">


          {/* HTML HEADER */}

          <div className="html-editor-header">

            <span>
              HTML
            </span>

          </div>


          {/* HTML EDITOR */}

          <div className="html-monaco-container">

            <Editor

              height="100%"
              width="100%"

              language="html"

              value={htmlCode}

              onChange={(value) => {

                setHtmlCode(
                  value || ""
                );

              }}

              theme={
                theme === "light"
                  ? "vs-light"
                  : "vs-dark"
              }

              options={{

                fontSize: 18,

                minimap: {
                  enabled: false,
                },

                automaticLayout: true,

                wordWrap: "on",

                padding: {
                  top: 20,
                  bottom: 20,
                },

                scrollBeyondLastLine:
                  false,
              }}

            />

          </div>

        </div>

      )}

    </main>
  );
}


export default CodeEditor;