import fs from "fs";
import path from "path";
import pug from "pug";
import hljs from 'highlight.js';

const siteDir = "./public";
const templateDir = "./templates";
const examplesDir = "./examples";

function renderSinglePage(filePath, contents, filenameOverride) {
  console.log(`Attempting to render ${filePath}/${filenameOverride ?? ""}`);
  if (!filePath.endsWith(".pug")) {
    filePath = filePath + ".pug";
  }
  const templatePath = path.join(templateDir, filePath);
  const template = fs.readFileSync(templatePath, "utf8");
  const html = pug.render(template, { pretty: true, filename: templatePath, data: contents  });

  if (filenameOverride) {
    filePath = `${filenameOverride}.pug`;
  }
  const htmlFile = filePath.replace(".pug", ".html");
  const htmlPath = path.join(siteDir, htmlFile);
  fs.writeFileSync(htmlPath, html);
}

function renderCodePages() {

  const dirs = fs.readdirSync(examplesDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory())

  for (const dir of dirs) {
    const dirPath = path.join(examplesDir, dir.name);
    const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter(file => file.isFile())
    const codeFile = files.find(file => file.name.endsWith(".js"));
    const scriptFile = files.find(file => file.name.endsWith(".sh"));

    if (!codeFile || !scriptFile) {
      console.log(`Skipping ${dir.name} as it does not have a code or script file`);
      break;
    };

    const content = {
      name: dir.name,
      code: fs.readFileSync(path.join(dirPath, codeFile.name), "utf8"),
      script: fs.readFileSync(path.join(dirPath, scriptFile.name), "utf8"),
    }

    const contents = {code: [], script: []};
    // read the code file and split it into sections
    const codeSections = content.code.split("\n\n\n");

    for (const section of codeSections) {
      let comment = "";
      let code = "";
      const lines = section.split("\n");
      for (const line of lines) {
        if (line.startsWith("//")) {
          comment += line.replace("//", "") + "\n";
        } else {
          code += line + "\n";
        }
      }
      contents.code.push({
        comment,
        code: hljs.highlight(code, { language: "javascript" }).value,
      });

    }
    // read the script file and split it into sections
    const scriptSections = content.script.split("\n\n\n");
    for (const section of scriptSections) {
      let comment = "";
      let script = "";
      const lines = section.split("\n");
      for (const line of lines) {
        if (line.startsWith("//")) {
          comment += line.replace("//", "") + "\n";
        } else {
          script += line + "\n";
        }
      }
      contents.script.push({ // I think this is the wrong way round
        comment,
        code: hljs.highlight(script, { language: "shell", ignoreIllegals: true }).value,
      });
    }
    renderSinglePage("content", { contents, title:dir.name } , dir.name);
  }
}

renderSinglePage("index", { title: "" });

renderCodePages();