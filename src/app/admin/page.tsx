"use client";
import React, { useState, useEffect } from "react";
import { getNewsletterList, saveNewsletterArticle } from "@/lib/admin-actions";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editMetadata, setEditMetadata] = useState<any>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cerbero2026") {
      setIsAuthorized(true);
      loadArticles();
    } else {
      alert("Password Errata");
    }
  };

  const loadArticles = async () => {
    const list = await getNewsletterList();
    setArticles(list);
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setEditContent(article.content || "");
    setEditMetadata({
      title: article.title || "",
      date: article.date || "",
      excerpt: article.excerpt || "",
      category: article.category || "",
      image: article.image || ""
    });
  };

  const handleSave = async () => {
    if (!selectedArticle) return;
    try {
      await saveNewsletterArticle(selectedArticle.slug, editContent, editMetadata);
      alert("Salvato con Successo!");
      loadArticles();
      setSelectedArticle(null);
    } catch (e) {
      alert("Errore durante il salvataggio");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-md">
          <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Cerbero Admin</h1>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full p-4 bg-black border border-white/10 rounded-xl mb-4 text-white focus:outline-none focus:ring-1 focus:ring-red-900"
          />
          <button type="submit" className="w-full p-4 bg-red-900 text-white font-bold rounded-xl uppercase tracking-widest">Accedi</button>
        </form>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white pt-32 px-10">
      <Navbar />
      <div className="max-w-7xl mx-auto flex gap-10">
        <div className="w-1/3 border-r border-white/5 pr-10">
          <h2 className="text-xl font-bold mb-6 uppercase tracking-widest">Contenuti Newsletter</h2>
          <div className="space-y-4">
            {articles.map(a => (
              <div 
                key={a.slug} 
                onClick={() => handleEdit(a)}
                className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl cursor-pointer hover:border-red-900/50 transition-all"
              >
                <p className="font-bold text-sm">{a.title}</p>
                <p className="text-xs text-gray-500">{a.slug}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3">
          {selectedArticle ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-widest">Editing: {selectedArticle.slug}</h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="bg-zinc-900 p-3 rounded-lg border border-white/10 text-white" 
                  value={editMetadata.title} 
                  onChange={e => setEditMetadata({...editMetadata, title: e.target.value})} 
                  placeholder="Titolo"
                />
                <input 
                  className="bg-zinc-900 p-3 rounded-lg border border-white/10 text-white" 
                  value={editMetadata.category} 
                  onChange={e => setEditMetadata({...editMetadata, category: e.target.value})} 
                  placeholder="Categoria"
                />
                <input 
                  className="bg-zinc-900 p-3 rounded-lg border border-white/10 text-white" 
                  value={editMetadata.date} 
                  onChange={e => setEditMetadata({...editMetadata, date: e.target.value})} 
                  placeholder="Data"
                />
                <input 
                  className="bg-zinc-900 p-3 rounded-lg border border-white/10 text-white" 
                  value={editMetadata.image} 
                  onChange={e => setEditMetadata({...editMetadata, image: e.target.value})} 
                  placeholder="Immagine URL"
                />
              </div>
              <textarea 
                className="w-full h-80 bg-zinc-900 p-6 rounded-2xl border border-white/10 font-mono text-sm text-white"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
              <button 
                onClick={handleSave}
                className="px-10 py-4 bg-red-900 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg"
              >
                Salva Modifiche
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-700">Seleziona un articolo per iniziare l'editing</div>
          )}
        </div>
      </div>
    </main>
  );
}
