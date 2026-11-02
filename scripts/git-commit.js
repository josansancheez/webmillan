/**
 * Actualiza la versión anti-caché y registra automáticamente el commit en Git
 * usando el binario local de GitHub Desktop.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync, execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const msgFile = path.join(__dirname, ".commit-msg.txt");

let commitMsg = process.argv.slice(2).join(" ").trim();
if (fs.existsSync(msgFile)) {
  const fileMsg = fs.readFileSync(msgFile, "utf8").trim();
  if (!commitMsg && fileMsg) commitMsg = fileMsg;
  try {
    fs.unlinkSync(msgFile);
  } catch (_) {}
}
if (!commitMsg) {
  commitMsg = "Actualizar web Millan Chiclana";
}

// 1. Actualizar versión anti-caché
try {
  execSync("node scripts/bump-cache-version.js", { cwd: ROOT, stdio: "inherit" });
} catch (_) {}

// 2. Localizar git.exe de GitHub Desktop
function findGitExe() {
  const localAppData = process.env.LOCALAPPDATA || "";
  const ghDesktopDir = path.join(localAppData, "GitHubDesktop");
  if (fs.existsSync(ghDesktopDir)) {
    const appDirs = fs
      .readdirSync(ghDesktopDir)
      .filter((d) => d.startsWith("app-"))
      .sort()
      .reverse();
    for (const dir of appDirs) {
      const candidate = path.join(ghDesktopDir, dir, "resources", "app", "git", "cmd", "git.exe");
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return "git";
}

const gitExe = findGitExe();
execFileSync(gitExe, ["add", "-A"], { cwd: ROOT, stdio: "inherit" });

const statusOut = execFileSync(gitExe, ["status", "--porcelain"], {
  cwd: ROOT,
  encoding: "utf8"
}).trim();

if (!statusOut) {
  console.log("Working tree clean (nothing to commit).");
} else {
  execFileSync(gitExe, ["commit", "-m", commitMsg], { cwd: ROOT, stdio: "inherit" });
}
