"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const https = require("https");
const unzipper = require("unzipper");
function activate(context) {
  let runProject = vscode.commands.registerCommand("jacamo.runProject", () =>
    __awaiter(this, void 0, void 0, function* () {
      const terminal = vscode.window.createTerminal("JaCaMo");
      terminal.show();
      terminal.sendText("./gradlew -q --console=plain");
    })
  );
  context.subscriptions.push(runProject);
  let createProject = vscode.commands.registerCommand(
    "jacamo.createProject",
    () =>
      __awaiter(this, void 0, void 0, function* () {
        const folderUri = yield vscode.window.showOpenDialog({
          canSelectFolders: true,
          openLabel: "Select Folder for JaCaMo Project",
        });
        if (!folderUri) {
          vscode.window.showErrorMessage("No folder selected.");
          return;
        }
        const projectPath = folderUri[0].fsPath;
        const jacamoZipUrl =
          "https://jacamo-lang.github.io/jacamo/nps/np1.3.zip"; // Ensure HTTPS
        const jacamoZipPath = path.join(projectPath, "jacamo.zip");
        vscode.window.showInformationMessage("Downloading JaCaMo...");
        const file = fs.createWriteStream(jacamoZipPath);
        https
          .get(jacamoZipUrl, (response) => {
            response.pipe(file);
            file.on("finish", () => {
              file.close();
              vscode.window.showInformationMessage("Extracting JaCaMo...");
              fs.createReadStream(jacamoZipPath)
                .pipe(unzipper.Extract({ path: projectPath }))
                .on("close", () => {
                  fs.unlinkSync(jacamoZipPath);
                  vscode.window.showInformationMessage(
                    "JaCaMo project created successfully."
                  );
                  createTemplateFiles(projectPath);
                });
            });
          })
          .on("error", (err) => {
            fs.unlinkSync(jacamoZipPath);
            vscode.window.showErrorMessage(
              "Error downloading JaCaMo: " + err.message
            );
          });
      })
  );
  context.subscriptions.push(createProject);
}
exports.activate = activate;
function createTemplateFiles(projectPath) {
  const srcPath = path.join(projectPath, "src");
  const agtPath = path.join(srcPath, "agt");
  const envPath = path.join(srcPath, "env");
  const orgPath = path.join(srcPath, "org");
  fs.mkdirSync(agtPath, { recursive: true });
  fs.mkdirSync(envPath, { recursive: true });
  fs.mkdirSync(orgPath, { recursive: true });
  fs.writeFileSync(
    path.join(agtPath, "alice.asl"),
    `!say_hello.\n+!say_hello <- .send(bob,tell,greeting("hello world")).`
  );
  fs.writeFileSync(
    path.join(agtPath, "bob.asl"),
    `+greeting(M)[source(A)] <- .print("I received ",M," from ",A).`
  );
  fs.writeFileSync(
    path.join(projectPath, "my1st_app.jcm"),
    `
mas my1st_app {
    agent alice
    agent bob
}
`
  );
}