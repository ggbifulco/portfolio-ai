import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'newsletter' o 'projects'
  const slug = searchParams.get('slug');

  if (!type || !slug) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  try {
    const filePath = path.join(process.cwd(), 'src', 'content', type, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);
    
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: "Contenuto non trovato. Crea il file .md corrispondente." });
  }
}
