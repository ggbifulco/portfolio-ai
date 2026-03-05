"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "newsletter");
const REGISTRY_FILE = path.join(process.cwd(), "src", "components", "Newsletter.tsx");

export async function getNewsletterList() {
  const files = fs.readdirSync(CONTENT_DIR);
  return files.map(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    return {
      slug: file.replace(".md", ""),
      content,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      category: data.category,
      image: data.image,
      ...data
    };
  });
}

export async function saveNewsletterArticle(slug: string, content: string, metadata: any) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const fileContent = matter.stringify(content, metadata);
  fs.writeFileSync(filePath, fileContent, "utf8");
  
  await syncNewsletterRegistry();
  return { success: true };
}

async function syncNewsletterRegistry() {
  const articles = await getNewsletterList();
  const newsIssues = articles.map((a: any) => ({
    slug: a.slug,
    title: a.title || "Senza Titolo",
    date: a.date || new Date().toLocaleDateString(),
    excerpt: a.excerpt || "",
    category: a.category || "General",
    image: a.image || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
  }));

  let registryContent = fs.readFileSync(REGISTRY_FILE, "utf8");
  const startMarker = "export const newsIssues = [";
  const endMarker = "];";
  
  const startIndex = registryContent.indexOf(startMarker);
  const endIndex = registryContent.indexOf(endMarker, startIndex);

  if (startIndex !== -1 && endIndex !== -1) {
    const newRegistry = `${startMarker}\n${newsIssues.map(n => `  ${JSON.stringify(n)}`).join(",\n")}\n`;
    const updatedContent = registryContent.substring(0, startIndex) + newRegistry + registryContent.substring(endIndex);
    fs.writeFileSync(REGISTRY_FILE, updatedContent, "utf8");
  }
}
