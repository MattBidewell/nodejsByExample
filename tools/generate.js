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

function extractCode(sections, lang) {
  const contents = [];
  for (const section of sections) {
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
    contents.push({
      comment,
      code: hljs.highlight(script, { language: lang, ignoreIllegals: true }).value,
    });
  }

  return contents;
}

function renderSingleExamplePage(exampleMeta) {
  const dirPath = path.join(examplesDir, exampleMeta.dir);
  const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter(file => file.isFile())
  if (files.length === 0) {
    console.log(`Skipping ${exampleMeta.dir} as it does not have any files`);
    return;
  }
  const codeFile = files.find(file => file.name.endsWith(".js"));
  const scriptFile = files.find(file => file.name.endsWith(".sh"));

  if (!codeFile || !scriptFile) {
    console.log(`Skipping ${dir.name} as it does not have a code or script file`);
    return;
  };


  const codeFileContents = fs.readFileSync(path.join(dirPath, codeFile.name), "utf8");
  const scriptFileContents = fs.readFileSync(path.join(dirPath, scriptFile.name), "utf8");

  const codeSections = codeFileContents.split("\n\n\n");
  const scriptSections = scriptFileContents.split("\n\n\n");

  const extractedCode = extractCode(codeSections, "javascript");
  const extractedScript = extractCode(scriptSections, "shell");

  renderSinglePage("content",
    {
      code: extractedCode,
      script: extractedScript,
      title: exampleMeta.title,
    }, exampleMeta.slug);
}

const fileOfExamples = fs.readFileSync("./examples/examples.json", "utf8");
const arrayOfExamples = JSON.parse(fileOfExamples);
// based on array of Examples - build the site each one at the time, allows us to use consistent titles in content and main page

renderSinglePage("index", { title: "", contents: arrayOfExamples });

for (const example of arrayOfExamples) {
  renderSingleExamplePage(example);
}