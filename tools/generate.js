import fs from "fs";
import path from "path";
import pug from "pug";
import hljs from 'highlight.js';

// import 'highlight.js/styles/github.css';

const siteDir = "./public";
const templateDir = "./templates";

// read file line by line from example directory

const templateFiles = fs.readdirSync(templateDir);

renderSinglePage("index");

renderCodePages();

function renderSinglePage(filePath, contents, filenameOverride) {
  if (!filePath.endsWith(".pug")) {
    filePath = filePath + ".pug";
  }
  const templatePath = path.join(templateDir, filePath);
  const template = fs.readFileSync(templatePath, "utf8");
  const html = pug.render(template, { pretty: true, filename: templatePath, contents });

  if (!filenameOverride) {
    filePath = `${filenameOverride}.pug`;
  }
  const htmlFile = filePath.replace(".pug", ".html");
  const htmlPath = path.join(siteDir, htmlFile);
  fs.writeFileSync(htmlPath, html);
}

function renderCodePages() {
  const contents = [
    {
      comment: "This is hello world!\n\nThis is a second paragraph.",
      code: hljs.highlight("function helloWorld() {\n  return 'Hello World!';\n}", { language: "javascript" }).value,
    }
  ]
  renderSinglePage("content", contents, "helloworld");
}