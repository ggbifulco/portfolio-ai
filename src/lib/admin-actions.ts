"use server";
import matter from "gray-matter";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER || "ggbifulco";
const REPO = process.env.GITHUB_REPO || "portfolio-ai";
const BRANCH = "main";

const CONFIG: any = {
  newsletter: { 
    dir: "src/content/newsletter", 
    registry: "src/components/Newsletter.tsx", 
    marker: "export const newsIssues = [",
    defaults: { title: "Nuova News", date: "05 Mar 2026", excerpt: "Sommario della news...", category: "AI Research", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" }
  },
  projects: { 
    dir: "src/content/projects", 
    registry: "src/data/projects.json", 
    isJson: true,
    defaults: { title: "Nuovo Progetto", desc: "Descrizione breve...", tech: ["Python", "PyTorch"], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" }
  },
  courses: { 
    dir: "src/content/academy/courses", 
    registry: "src/components/Academy.tsx", 
    marker: "export const coursesData = [",
    defaults: { title: "Nuovo Corso", modules: 0, level: "Beginner", gradient: "from-red-900 to-red-600", category: "AI", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", description: "Descrizione estesa...", videos: [] }
  },
  pills: { 
    dir: "src/content/academy/pills", 
    registry: "src/components/Academy.tsx", 
    marker: "export const pillsData = [",
    defaults: { title: "Nuova Pill", duration: "5 min", category: "Models", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400", videos: [] }
  }
};

async function fetchGitHub(path: string, method = "GET", body?: any) {
  if (!GITHUB_TOKEN) return { error: "GITHUB_TOKEN non configurato" };
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
  if (res.status === 404 && method === "GET") return { notFound: true };
  const data = await res.json();
  if (!res.ok) return { error: `GitHub API ${res.status}: ${data.message || res.statusText}`, status: res.status };
  return data;
}

export async function getContentList(type: string) {
  try {
    const conf = CONFIG[type];
    const data = await fetchGitHub(conf.dir);
    if (data.error || data.notFound) return [];
    if (!Array.isArray(data)) return [];

    const list = await Promise.all(data.map(async (file: any) => {
      const fileData = await fetchGitHub(file.path);
      if (fileData.error) return null;
      const cleanBase64 = fileData.content.replace(/\n/g, "");
      const content = Buffer.from(cleanBase64, "base64").toString("utf8");
      const { data: metadata, content: body } = matter(content);
      return { slug: file.name.replace(".md", ""), content: body, ...metadata, sha: fileData.sha };
    }));
    return list.filter(item => item !== null);
  } catch (err) { return []; }
}

export async function saveContent(type: string, slug: string, content: string, metadata: any) {
  try {
    const conf = CONFIG[type];
    const filePath = `${conf.dir}/${slug}.md`;
    const existingFile = await fetchGitHub(filePath);
    
    const fileContent = matter.stringify(content, metadata);
    const base64Content = Buffer.from(fileContent).toString("base64");

    const payload: any = {
      message: `cms: save ${type} ${slug}`,
      content: base64Content,
      branch: BRANCH
    };
    if (!existingFile.notFound && existingFile.sha) payload.sha = existingFile.sha;

    const updateRes = await fetchGitHub(filePath, "PUT", payload);
    if (updateRes.error) return { success: false, error: updateRes.error };

    await syncRegistry(type);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function syncRegistry(type: string) {
  const conf = CONFIG[type];
  const articles = await getContentList(type);
  const registryFile = await fetchGitHub(conf.registry);
  const cleanBase64 = registryFile.content.replace(/\n/g, "");
  const registryContent = Buffer.from(cleanBase64, "base64").toString("utf8");

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
      updatedContent = registryContent.substring(0, startIndex) + `${conf.marker}\n${dataItems.join(",\n")}\n` + registryContent.substring(endIndex);
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

export async function getDefaults(type: string) {
  return CONFIG[type]?.defaults || {};
}
