"use client";
import React, { useState, useEffect } from "react";
import { getContentList, saveContent } from "@/lib/admin-actions";
import Navbar from "@/components/Navbar";

const CONTENT_TYPES = [
  { id: "newsletter", label: "Newsletter" },
  { id: "projects", label: "Progetti" },
  { id: "courses", label: "Corsi Academy" },
  { id: "pills", label: "Lezioni (Pills)" }
];

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [activeType, setActiveType] = useState("newsletter");
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editMetadata, setEditMetadata] = useState<any>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cerbero2026") {
      setIsAuthorized(true);
      loadItems("newsletter");
    } else {
      alert("Password Errata");
    }
  };

  const loadItems = async (type: string) => {
    const list = await getContentList(type);
    setItems(list);
    setActiveType(type);
    setSelectedItem(null);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditContent(item.content || "");
    const { content, ...metadata } = item;
    setEditMetadata(metadata);
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      await saveContent(activeType, selectedItem.slug, editContent, editMetadata);
      alert("Salvato con Successo!");
      loadItems(activeType);
      setSelectedItem(null);
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
    <main className="bg-black min-h-screen text-white pt-32 px-10 pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-10 border-b border-white/5 pb-6">
          {CONTENT_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => loadItems(t.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                activeType === t.id ? "bg-red-900 border-red-700" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-10">
          <div className="w-1/3 border-r border-white/5 pr-10 h-[calc(100vh-350px)] overflow-y-auto">
            <div className="space-y-4">
              {items.map(a => (
                <div 
                  key={a.slug} 
                  onClick={() => handleEdit(a)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedItem?.slug === a.slug ? "bg-red-900/20 border-red-900" : "bg-zinc-900/50 border-white/5 hover:border-white/20"
                  }`}
                >
                  <p className="font-bold text-sm">{a.title || a.slug}</p>
                  <p className="text-xs text-gray-500">{a.slug}</p>
                </div>
              ))}
              <button 
                onClick={() => alert("Funzionalità Nuova Voce in arrivo...")}
                className="w-full p-4 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                + Aggiungi Nuovo
              </button>
            </div>
          </div>

          <div className="w-2/3">
            {selectedItem ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Editing: {selectedItem.slug}</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(editMetadata).filter(k => k !== "slug").map(key => (
                    <div key={key}>
                      <label className="text-[8px] uppercase tracking-widest text-gray-500 font-black mb-1 block">{key}</label>
                      <input 
                        className="w-full bg-zinc-900 p-3 rounded-lg border border-white/10 text-white text-xs" 
                        value={editMetadata[key]} 
                        onChange={e => setEditMetadata({...editMetadata, [key]: e.target.value})} 
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[8px] uppercase tracking-widest text-gray-500 font-black mb-1 block">Corpo Articolo (Markdown)</label>
                  <textarea 
                    className="w-full h-80 bg-zinc-900 p-6 rounded-2xl border border-white/10 font-mono text-sm text-white"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleSave}
                  className="px-10 py-4 bg-red-900 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg hover:bg-white hover:text-black transition-all"
                >
                  Salva Modifiche
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-700 uppercase tracking-widest text-xs font-black">Seleziona un elemento per iniziare l'editing</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
