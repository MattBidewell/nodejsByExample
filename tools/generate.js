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
  const html = pug.render(template, {
    pretty: true,
    filename: templatePath,
    data: contents
  });

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
  const isDir = fs.existsSync(dirPath);
  if (!isDir) {
    console.log(`Skipping ${exampleMeta.dir} as it is not a directory`);
    return;
  };

  // collect subirs in numeric order
  const subDirs = fs.readdirSync(dirPath, { withFileTypes: true }).filter(file => file.isDirectory()).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const pageContents = [];

  for (const subDir of subDirs) {
    const files = fs.readdirSync(`${dirPath}/${subDir.name}`, { withFileTypes: true }).filter(file => file.isFile())

    if (files.length === 0) {
      console.log(`Skipping ${exampleMeta.dir}/${subDir.dir} as it does not have any files`);
      continue;
    }

    const codeFile = files.find(file => file.name.endsWith(".js"));
    const scriptFile = files.find(file => file.name.endsWith(".sh"));

    if (!codeFile && !scriptFile) {
      console.log(`Skipping ${exampleMeta.dir}/${subDir.dir} as it does not have a code or script file`);
      continue;
    };

    const codeFileContents = codeFile ? fs.readFileSync(path.join(`${dirPath}/${subDir.name}`, codeFile.name), "utf8") : null;
    const scriptFileContents = scriptFile ? fs.readFileSync(path.join(`${dirPath}/${subDir.name}`, scriptFile.name), "utf8") : null;

    const codeSections = codeFileContents ? codeFileContents.split("\n\n\n") : [];
    const scriptSections = scriptFileContents ? scriptFileContents.split("\n\n\n") : [];

    pageContents.push({
      code: extractCode(codeSections, "javascript"),
      script: extractCode(scriptSections, "shell"),
    });
  }

  renderSinglePage("content",
    {
      contents: pageContents,
      title: exampleMeta.title,
      next: exampleMeta.next,
      previous: exampleMeta.previous,
    }, exampleMeta.slug);
}

function buildSite() {
  const contents = JSON.parse(fs.readFileSync("./examples/contents.json", "utf8"));

  // based on array of Examples - build the site each one at the time, allows us to use consistent titles in content and main page
  const filteredExamples = contents.filter((example) => fs.existsSync(path.join(examplesDir, example.dir)));

  renderSinglePage("index", {
    title: "",
    contents: filteredExamples,
    next: filteredExamples[0],
    previous: {
      slug: "/",
      title: "Home"
    }
  });

  for (const [index, data] of filteredExamples.entries()) {
    const next = filteredExamples[index + 1] ?? { slug: "/" };
    const previous = filteredExamples[index - 1] ?? { slug: "/" };
    const example = {...data, next, previous};

    renderSingleExamplePage(example);
  }
}

buildSite();