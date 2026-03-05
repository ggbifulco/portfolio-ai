"use client";
import React, { useState, useEffect } from "react";
import { getContentList, saveContent, getDefaults } from "@/lib/admin-actions";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    try {
      const list = await getContentList(type);
      setItems(list);
      setActiveType(type);
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.message || "Errore caricamento");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    const slug = prompt("Inserisci lo slug (es: nuovo-articolo):");
    if (!slug) return;
    
    const defaults = await getDefaults(activeType);
    setSelectedItem({ slug, isNew: true });
    setEditContent("");
    setEditMetadata({ ...defaults });
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditContent(item.content || "");
    const { content, sha, ...metadata } = item;
    setEditMetadata(metadata);
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    setLoading(true);
    setError(null);
    try {
      // Validazione JSON per i video se presenti
      let finalMetadata = { ...editMetadata };
      if (typeof finalMetadata.videos === 'string') {
        try {
          finalMetadata.videos = JSON.parse(finalMetadata.videos);
        } catch (e) {
          alert("Errore nel formato JSON dei video!");
          setLoading(false);
          return;
        }
      }

      const result = await saveContent(activeType, selectedItem.slug, editContent, finalMetadata);
      if (result.success) {
        alert("Salvato con Successo su GitHub!");
        await loadItems(activeType);
        setSelectedItem(null);
      } else {
        setError(result.error || "Errore durante il salvataggio");
      }
    } catch (e: any) {
      setError("Eccezione: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
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
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <div className="flex gap-4">
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
          <button 
            onClick={handleAddNew}
            className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-900 hover:text-white transition-all"
          >
            + Aggiungi Nuovo
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/20 border border-red-900 text-red-500 rounded-xl text-xs font-mono">
            <strong>ERRORE:</strong> {error}
          </div>
        )}

        <div className="flex gap-10">
          <div className="w-1/4 border-r border-white/5 pr-10 h-[calc(100vh-350px)] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="text-gray-600 uppercase tracking-widest text-[10px] animate-pulse">Sincronizzazione GitHub...</div>
            ) : (
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
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{a.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-3/4">
            {selectedItem ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold uppercase tracking-widest">Editing: {selectedItem.slug}</h2>
                  {selectedItem.sha && <span className="text-[10px] font-mono text-gray-600 uppercase">File Verificato su GitHub</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
                  {Object.keys(editMetadata).map(key => (
                    <div key={key} className={key === "videos" || key === "description" ? "col-span-2" : ""}>
                      <label className="text-[8px] uppercase tracking-widest text-red-700 font-black mb-1 block">{key}</label>
                      {key === "videos" ? (
                        <textarea 
                          className="w-full h-32 bg-black/50 p-3 rounded-lg border border-white/10 text-white text-xs font-mono" 
                          value={typeof editMetadata[key] === 'object' ? JSON.stringify(editMetadata[key], null, 2) : editMetadata[key]} 
                          onChange={e => setEditMetadata({...editMetadata, [key]: e.target.value})} 
                          placeholder='[{"id": 1, "title": "Video 1", "thumb": "URL", "duration": "5:00", "desc": "..."}]'
                        />
                      ) : key === "description" || key === "desc" || key === "excerpt" ? (
                        <textarea 
                          className="w-full h-20 bg-black/50 p-3 rounded-lg border border-white/10 text-white text-xs" 
                          value={editMetadata[key]} 
                          onChange={e => setEditMetadata({...editMetadata, [key]: e.target.value})} 
                        />
                      ) : (
                        <input 
                          className="w-full bg-black/50 p-3 rounded-lg border border-white/10 text-white text-xs" 
                          value={editMetadata[key]} 
                          onChange={e => setEditMetadata({...editMetadata, [key]: e.target.value})} 
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[8px] uppercase tracking-widest text-red-700 font-black mb-1 block">Contenuto Markdown</label>
                  <textarea 
                    className="w-full h-96 bg-zinc-900 p-6 rounded-2xl border border-white/10 font-mono text-sm text-white focus:border-red-900 outline-none transition-all"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-10 py-4 bg-red-900 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg hover:bg-white hover:text-black transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Commit in corso..." : "Salva Modifiche e Pusha su GitHub"}
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-700 uppercase tracking-widest text-xs font-black italic">
                {loading ? "Recupero dati..." : "Seleziona un elemento o clicca su 'Aggiungi Nuovo'"}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
