"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_CONTENT_DIR = path.join(process.cwd(), "src", "content");

const CONFIG: any = {
  newsletter: {
    dir: "newsletter",
    registry: "src/components/Newsletter.tsx",
    marker: "export const newsIssues = ["
  },
  projects: {
    dir: "projects",
    registry: "src/data/projects.json",
    isJson: true
  },
  courses: {
    dir: "academy/courses",
    registry: "src/components/Academy.tsx",
    marker: "export const coursesData = ["
  },
  pills: {
    dir: "academy/pills",
    registry: "src/components/Academy.tsx",
    marker: "export const pillsData = ["
  }
};

export async function getContentList(type: string) {
  const conf = CONFIG[type];
  if (!conf) throw new Error("Tipo non valido");
  
  const dirPath = path.join(BASE_CONTENT_DIR, conf.dir);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".md"));
  return files.map(file => {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    return {
      slug: file.replace(".md", ""),
      content,
      ...data
    };
  });
}

export async function saveContent(type: string, slug: string, content: string, metadata: any) {
  const conf = CONFIG[type];
  const dirPath = path.join(BASE_CONTENT_DIR, conf.dir);
  const filePath = path.join(dirPath, `${slug}.md`);
  
  const fileContent = matter.stringify(content, metadata);
  fs.writeFileSync(filePath, fileContent, "utf8");
  
  await syncRegistry(type);
  return { success: true };
}

async function syncRegistry(type: string) {
  const conf = CONFIG[type];
  const articles = await getContentList(type);
  const registryPath = path.join(process.cwd(), conf.registry);

  if (conf.isJson) {
    const jsonData = articles.map((a: any) => {
      const { content, ...rest } = a;
      return {
        ...rest,
        desc: a.desc || a.excerpt || ""
      };
    });
    fs.writeFileSync(registryPath, JSON.stringify(jsonData, null, 2), "utf8");
  } else {
    let registryContent = fs.readFileSync(registryPath, "utf8");
    const startMarker = conf.marker;
    const endMarker = "];";
    
    const startIndex = registryContent.indexOf(startMarker);
    const endIndex = registryContent.indexOf(endMarker, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      const dataItems = articles.map((a: any) => {
          const { content, ...item } = a;
          return `  ${JSON.stringify(item)}`;
      });
      const newRegistry = `${startMarker}\n${dataItems.join(",\n")}\n`;
      const updatedContent = registryContent.substring(0, startIndex) + newRegistry + registryContent.substring(endIndex);
      fs.writeFileSync(registryPath, updatedContent, "utf8");
    }
  }
}
