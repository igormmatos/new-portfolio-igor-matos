import fs from "fs";
import path from "path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const readmePath = path.join(root, "README.md");
const pkg = JSON.parse(read("package.json"));
const todo = read("TODO.md");

const getSection = (label) => {
  const lines = todo.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === label);
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) break;
    if (line.startsWith("### ")) break;
    if (line.trim().startsWith("- ")) out.push(line.trim().slice(2));
  }
  return out;
};

const getObjective = () => {
  const match = todo.match(/## Objetivo atual do projeto\s*([\s\S]*?)\n## /);
  if (!match) return "";
  return match[1].trim().replace(/\r?\n/g, " ");
};

const getObjectiveEn = () => {
  const match = todo.match(/## Objective \(EN\)\s*([\s\S]*?)\n## /);
  if (!match) return "";
  return match[1].trim().replace(/\r?\n/g, " ");
};

const getTopItems = (sectionLabel, limit = 5) => {
  const lines = todo.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === sectionLabel);
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("### ")) break;
    if (line.startsWith("## ")) break;
    if (line.startsWith("- ")) out.push(line.slice(2));
    if (out.length >= limit) break;
  }
  return out;
};

const testCommand = pkg.scripts?.test ? `npm run test` : "npm test";
const devCommand = pkg.scripts?.dev ? `npm run dev` : "npm start";
const buildCommand = pkg.scripts?.build ? `npm run build` : "npm run build";

const objective = getObjective();
const objectiveEn = getObjectiveEn();
const p0 = getTopItems("### P0 (crítico)");
const p1 = getTopItems("### P1 (importante)");
const p2 = getTopItems("### P2 (refino)");

const toList = (items) => (items.length ? items.map((i) => `- ${i}`).join("\n") : "- (empty)");

const autoBlock = `
### EN
**Status**
- Project: ${pkg.name} v${pkg.version}
- Objective: ${objectiveEn || "(see PT)"}

**Commands**
- Dev: \`${devCommand}\`
- Build: \`${buildCommand}\`
- Test: \`${testCommand}\`
- README: \`npm run readme:gen\`

**Roadmap snapshot**
**P0**
${toList(p0)}

**P1**
${toList(p1)}

**P2**
${toList(p2)}

### PT
**Status**
- Projeto: ${pkg.name} v${pkg.version}
- Objetivo: ${objective || "(não encontrado)"}

**Comandos**
- Dev: \`${devCommand}\`
- Build: \`${buildCommand}\`
- Teste: \`${testCommand}\`
- README: \`npm run readme:gen\`

**Snapshot do roadmap**
**P0**
${toList(p0)}

**P1**
${toList(p1)}

**P2**
${toList(p2)}
`.trim();

const startMarker = "<!-- AUTO-GENERATED:START -->";
const endMarker = "<!-- AUTO-GENERATED:END -->";

const readme = fs.readFileSync(readmePath, "utf8");
const startIdx = readme.indexOf(startMarker);
const endIdx = readme.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  throw new Error("Auto-generated markers not found in README.md");
}

const before = readme.slice(0, startIdx + startMarker.length);
const after = readme.slice(endIdx);
const updated = `${before}\n${autoBlock}\n${after}`;

fs.writeFileSync(readmePath, updated, "utf8");
