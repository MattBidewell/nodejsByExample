import fs from "fs";
import path from "path";
import pug from "pug";
import hljs from 'highlight.js';

// Default configuration
const defaultConfig = {
  siteDir: "./public",
  templateDir: "./templates",
  examplesDir: "./examples",
  contentsFile: "./examples/contents.json"
};

export function renderSinglePage(filePath, contents, filenameOverride, config = defaultConfig) {
  const { siteDir, templateDir } = config;
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

export function extractCode(sections, lang) {
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

export function renderSingleExamplePage(exampleMeta, config = defaultConfig) {
  const { examplesDir } = config;
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
      slug: exampleMeta.slug,
      description: exampleMeta.description,
      next: exampleMeta.next,
      previous: exampleMeta.previous,
    }, exampleMeta.slug, config);
}

export function generateSitemap(examples, config = defaultConfig) {
  const { siteDir } = config;
  const baseUrl = "https://nodejsbyexample.com";
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  for (const example of examples) {
    sitemap += `  <url>
    <loc>${baseUrl}/${example.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  sitemap += `</urlset>`;
  
  fs.writeFileSync(path.join(siteDir, "sitemap.xml"), sitemap);
  console.log("Generated sitemap.xml");
}

export function buildSite(config = defaultConfig) {
  const mergedConfig = { ...defaultConfig, ...config };
  const { examplesDir, contentsFile } = mergedConfig;
  
  const contents = JSON.parse(fs.readFileSync(contentsFile, "utf8"));

  // Flatten all tutorials from categories for processing
  const allTutorials = contents.categories.flatMap(cat => cat.items);

  // Filter to only existing directories
  const filteredExamples = allTutorials.filter((example) => 
    fs.existsSync(path.join(examplesDir, example.dir))
  );

  // Filter categories to only include existing tutorials
  const filteredCategories = contents.categories.map(cat => ({
    name: cat.name,
    items: cat.items.filter(item => 
      fs.existsSync(path.join(examplesDir, item.dir))
    )
  })).filter(cat => cat.items.length > 0);

  renderSinglePage("index", {
    title: "",
    slug: "",
    description: "Learn Node.js through hands-on annotated code examples. A comprehensive tutorial covering core modules, networking, testing, and modern Node.js features.",
    categories: filteredCategories,
    next: filteredExamples[0],
    previous: filteredExamples[filteredExamples.length - 1],
  }, null, mergedConfig);

  // Generate sitemap.xml for SEO
  generateSitemap(filteredExamples, mergedConfig);

  for (const [index, data] of filteredExamples.entries()) {
    const next = filteredExamples[index + 1] ?? { slug: "/" };
    const previous = filteredExamples[index - 1] ?? { slug: "/" };
    const example = {...data, next, previous};

    renderSingleExamplePage(example, mergedConfig);
  }
}

// CLI entry point - only run when executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  buildSite();
}