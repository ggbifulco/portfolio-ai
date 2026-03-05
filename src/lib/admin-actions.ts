"use server";
import matter from "gray-matter";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER || "ggbifulco";
const REPO = process.env.GITHUB_REPO || "portfolio-ai";
const BRANCH = "main";

const CONFIG: any = {
  newsletter: { dir: "src/content/newsletter", registry: "src/components/Newsletter.tsx", marker: "export const newsIssues = [" },
  projects: { dir: "src/content/projects", registry: "src/data/projects.json", isJson: true },
  courses: { dir: "src/content/academy/courses", registry: "src/components/Academy.tsx", marker: "export const coursesData = [" },
  pills: { dir: "src/content/academy/pills", registry: "src/components/Academy.tsx", marker: "export const pillsData = [" }
};

async function fetchGitHub(path: string, method = "GET", body?: any) {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN non configurato nelle variabili d'ambiente");
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(`GitHub API Error (${res.status}): ${errData.message || res.statusText}`);
  }

  return res.json();
}

export async function getContentList(type: string) {
  try {
    const conf = CONFIG[type];
    const data = await fetchGitHub(conf.dir);
    if (!Array.isArray(data)) return [];

    const list = await Promise.all(data.map(async (file: any) => {
      try {
        const fileData = await fetchGitHub(file.path);
        const content = Buffer.from(fileData.content, "base64").toString("utf8");
        const { data: metadata, content: body } = matter(content);
        return {
          slug: file.name.replace(".md", ""),
          content: body,
          ...metadata,
          sha: fileData.sha
        };
      } catch (e) {
        console.error(`Error fetching file ${file.path}:`, e);
        return null;
      }
    }));
    return list.filter(item => item !== null);
  } catch (err: any) {
    console.error("Error in getContentList:", err);
    throw new Error(err.message);
  }
}

export async function saveContent(type: string, slug: string, content: string, metadata: any) {
  try {
    const conf = CONFIG[type];
    const filePath = `${conf.dir}/${slug}.md`;
    
    const existingFile = await fetchGitHub(filePath);
    const sha = existingFile.sha;

    const fileContent = matter.stringify(content, metadata);
    const base64Content = Buffer.from(fileContent).toString("base64");

    await fetchGitHub(filePath, "PUT", {
      message: `cms: update ${type} ${slug}`,
      content: base64Content,
      sha,
      branch: BRANCH
    });

    await syncRegistry(type);
    
    return { success: true };
  } catch (err: any) {
    console.error("Error saving content to GitHub:", err);
    throw new Error(err.message);
  }
}

async function syncRegistry(type: string) {
  const conf = CONFIG[type];
  const articles = await getContentList(type);
  const registryFile = await fetchGitHub(conf.registry);
  const registryContent = Buffer.from(registryFile.content, "base64").toString("utf8");

  let updatedContent = "";

  if (conf.isJson) {
    const jsonData = articles.map((a: any) => {
      const { content, sha, ...rest } = a;
      return { ...rest, desc: a.desc || a.excerpt || "" };
    });
    updatedContent = JSON.stringify(jsonData, null, 2);
  } else {
    const startIndex = registryContent.indexOf(conf.marker);
    const endIndex = registryContent.indexOf("];", startIndex);
    if (startIndex !== -1 && endIndex !== -1) {
      const dataItems = articles.map((a: any) => {
          const { content, sha, ...item } = a;
          return `  ${JSON.stringify(item)}`;
      });
      const newRegistryBlock = `${conf.marker}\n${dataItems.join(",\n")}\n`;
      updatedContent = registryContent.substring(0, startIndex) + newRegistryBlock + registryContent.substring(endIndex);
    }
  }

  if (updatedContent && updatedContent !== registryContent) {
    await fetchGitHub(conf.registry, "PUT", {
      message: `cms: sync registry for ${type}`,
      content: Buffer.from(updatedContent).toString("base64"),
      sha: registryFile.sha,
      branch: BRANCH
    });
  }
}
