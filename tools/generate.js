import fs from "fs";
import path from "path";
import pug from "pug";
import hljs from 'highlight.js';

const siteDir = "./public";
const templateDir = "./templates";
const examplesDir = "./examples";

function renderSinglePage(filePath, contents, filenameOverride) {
  if (!filePath.endsWith(".pug")) {
    filePath = filePath + ".pug";
  }
  const templatePath = path.join(templateDir, filePath);
  const template = fs.readFileSync(templatePath, "utf8");
  const html = pug.render(template, { pretty: true, filename: templatePath, contents });

  if (filenameOverride) {
    filePath = `${filenameOverride}.pug`;
  }
  const htmlFile = filePath.replace(".pug", ".html");
  const htmlPath = path.join(siteDir, htmlFile);
  fs.writeFileSync(htmlPath, html);
}

function renderCodePages() {

  // read contents of examples directory nested directories
  // const contents = [];
  const dirs = fs.readdirSync(examplesDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory())

  for (const dir of dirs) {
    const dirPath = path.join(examplesDir, dir.name);
    const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter(file => file.isFile())
    const codeFile = files.find(file => file.name.endsWith(".js"));
    const scriptFile = files.find(file => file.name.endsWith(".sh"));

    const content = {
      name: dir.name,
      code: fs.readFileSync(path.join(dirPath, codeFile.name), "utf8"),
      script: fs.readFileSync(path.join(dirPath, scriptFile.name), "utf8"),
    }

    const contents = [];
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
      contents.push({
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
      contents.push({ // I think this is the wrong way round
        comment,
        code: hljs.highlight(script, { language: "shell", ignoreIllegals: true }).value,
      });
    }
    renderSinglePage("content", contents, dir.name);
  }
}

renderSinglePage("index");

renderCodePages();