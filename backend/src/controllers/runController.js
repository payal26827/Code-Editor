 import { spawn } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

// ==========================================
// RUN DOCKER
// ==========================================

const runDocker = async (
  image,
  command,
  code,
  fileName,
  stdin = "",
  timeout = 30000
) => {
  let tempDir;

  try {
    // ======================================
    // CREATE TEMP DIRECTORY
    // ======================================

    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "code-run-")
    );

    // ======================================
    // CREATE SOURCE FILE
    // ======================================

    const sourcePath = path.join(
      tempDir,
      fileName
    );

    await fs.writeFile(
      sourcePath,
      code,
      "utf8"
    );

    // ======================================
    // DOCKER ARGUMENTS
    // ======================================

    const args = [
      "run",
      "--rm",

      // No internet
      "--network",
      "none",

      // Memory limit
      "--memory",
      "256m",

      // CPU limit
      "--cpus",
      "1",

      // Workspace
      "--mount",
      `type=bind,source=${tempDir},target=/workspace`,

      // Enable stdin
      "-i",

      image,

      ...command,
    ];

    console.log("\n==============================");
    console.log("Starting Docker");
    console.log("==============================");

    console.log(
      "Docker command:",
      args.join(" ")
    );

    console.log(
      "Input:",
      JSON.stringify(stdin)
    );

    // ======================================
    // START DOCKER
    // ======================================

    const docker = spawn(
      "docker",
      args,
      {
        stdio: [
          "pipe",
          "pipe",
          "pipe",
        ],
      }
    );

    let output = "";
    let errorOutput = "";
    let finished = false;

    // ======================================
    // STDOUT
    // ======================================

    docker.stdout.on(
      "data",
      (data) => {
        const text = data.toString();

        output += text;

        console.log(
          "Docker stdout:",
          JSON.stringify(text)
        );
      }
    );

    // ======================================
    // STDERR
    // ======================================

    docker.stderr.on(
      "data",
      (data) => {
        const text = data.toString();

        errorOutput += text;

        console.log(
          "Docker stderr:",
          JSON.stringify(text)
        );
      }
    );

    // ======================================
    // SEND INPUT
    // ======================================

    const input =
      typeof stdin === "string"
        ? stdin
        : String(stdin ?? "");

    // IMPORTANT:
    // Send input and close stdin
    docker.stdin.end(input);

    // ======================================
    // RETURN PROMISE
    // ======================================

    return await new Promise(
      (resolve) => {

        // ==================================
        // TIMEOUT
        // ==================================

        const timer = setTimeout(() => {

          if (finished) {
            return;
          }

          finished = true;

          console.log(
            "Docker execution timeout"
          );

          docker.kill();

          resolve({
            success: false,
            output,
            error:
              "Program execution timed out",
          });

        }, timeout);

        // ==================================
        // DOCKER CLOSE
        // ==================================

        docker.on(
          "close",
          async (exitCode) => {

            if (finished) {
              return;
            }

            finished = true;

            clearTimeout(timer);

            console.log(
              "Docker exit code:",
              exitCode
            );

            console.log(
              "Final stdout:",
              JSON.stringify(output)
            );

            console.log(
              "Final stderr:",
              JSON.stringify(errorOutput)
            );

            // ==================================
            // CLEAN TEMP DIRECTORY
            // ==================================

            try {
              await fs.rm(
                tempDir,
                {
                  recursive: true,
                  force: true,
                }
              );
            } catch (error) {
              console.error(
                "Cleanup error:",
                error.message
              );
            }

            // ==================================
            // RESULT
            // ==================================

            if (exitCode === 0) {

              resolve({
                success: true,
                output:
                  output ||
                  "Program executed successfully",
                error: null,
              });

            } else {

              resolve({
                success: false,
                output,
                error:
                  errorOutput ||
                  `Program exited with code ${exitCode}`,
              });

            }
          }
        );

        // ==================================
        // DOCKER ERROR
        // ==================================

        docker.on(
          "error",
          async (error) => {

            if (finished) {
              return;
            }

            finished = true;

            clearTimeout(timer);

            console.error(
              "Docker spawn error:",
              error.message
            );

            try {
              await fs.rm(
                tempDir,
                {
                  recursive: true,
                  force: true,
                }
              );
            } catch {}

            resolve({
              success: false,
              output,
              error: error.message,
            });
          }
        );
      }
    );

  } catch (error) {

    console.error(
      "runDocker error:",
      error
    );

    if (tempDir) {
      try {
        await fs.rm(
          tempDir,
          {
            recursive: true,
            force: true,
          }
        );
      } catch {}
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// RUN CODE
// ==========================================

export const runCode = async (
  req,
  res
) => {

  try {

    const {
      language,
      code,
      stdin = "",
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!language || !code) {

      return res.status(400).json({
        success: false,
        message:
          "Language and code are required",
      });

    }

    console.log("\n==============================");
    console.log("RUN CODE");
    console.log("==============================");

    console.log(
      "Language:",
      language
    );

    console.log(
      "Input:",
      JSON.stringify(stdin)
    );

    // ======================================
    // JAVASCRIPT
    // ======================================

    if (language === "javascript") {

      const result =
        await runDocker(
          "node:22-alpine",
          [
            "node",
            "/workspace/main.js",
          ],
          code,
          "main.js",
          stdin
        );

      return res.json(result);
    }

    // ======================================
    // PYTHON
    // ======================================

    if (language === "python") {

      const result =
        await runDocker(
          "python:3.12-alpine",
          [
            "python3",
            "/workspace/main.py",
          ],
          code,
          "main.py",
          stdin
        );

      return res.json(result);
    }

    // ======================================
    // C
    // ======================================

    if (language === "c") {

      const result =
        await runDocker(
          "gcc:14",
          [
            "sh",
            "-c",
            "gcc /workspace/main.c -o /tmp/main && /tmp/main",
          ],
          code,
          "main.c",
          stdin
        );

      return res.json(result);
    }

    // ======================================
    // C++
    // ======================================

    if (language === "cpp") {

      const result =
        await runDocker(
          "gcc:14",
          [
            "sh",
            "-c",
            "g++ /workspace/main.cpp -o /tmp/main && /tmp/main",
          ],
          code,
          "main.cpp",
          stdin
        );

      return res.json(result);
    }

    // ======================================
    // JAVA
    // ======================================

    if (language === "java") {

      const classMatch =
        code.match(
          /public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/
        );

      const className =
        classMatch?.[1] || "Main";

      const fileName =
        `${className}.java`;

      console.log(
        "Java class:",
        className
      );

      const result =
        await runDocker(
          "eclipse-temurin:21-jdk-noble",
          [
            "sh",
            "-c",
            `javac /workspace/${fileName} && java -cp /workspace ${className}`,
          ],
          code,
          fileName,
          stdin
        );

      return res.json(result);
    }

    // ======================================
    // HTML
    // ======================================

    if (language === "html") {

      return res.json({
        success: true,
        output: code,
        type: "html",
      });

    }

    // ======================================
    // CSS
    // ======================================

    if (language === "css") {

      return res.json({
        success: true,
        output: code,
        type: "css",
      });

    }

    // ======================================
    // UNSUPPORTED
    // ======================================

    return res.status(400).json({
      success: false,
      message:
        `Unsupported language: ${language}`,
    });

  } catch (error) {

    console.error(
      "Run code error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Code execution failed",
      error:
        error.message,
    });

  }
};