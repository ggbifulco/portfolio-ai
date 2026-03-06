"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getContentList, saveContent, deleteContent, getDefaults } from "@/lib/admin-actions";
import dynamic from "next/dynamic";
import {
  Plus, Save, Trash2, ChevronRight, Search, X, Rocket,
  CheckCircle, AlertCircle, Info, Image as ImageIcon, Tag, Hash,
  FileText, BookOpen, Newspaper, Zap, ArrowLeft, Eye, EyeOff,
  RefreshCw, ExternalLink
} from "lucide-react";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────
type ContentType = "newsletter" | "projects" | "courses" | "pills" | "broadcast";
type ToastKind = "success" | "error" | "info";
interface Toast { id: number; message: string; kind: ToastKind }
interface FieldSchema {
  key: string; label: string; type: "text" | "textarea" | "image" | "tags" | "json" | "number" | "select";
  fullWidth?: boolean; rows?: number; required?: boolean; placeholder?: string; options?: string[];
}

// ─── Field schemas per content type ──────────────────────────────────────────
const SCHEMAS: Record<string, FieldSchema[]> = {
  newsletter: [
    { key: "title",    label: "Titolo",         type: "text",     fullWidth: true, required: true },
    { key: "date",     label: "Data",            type: "text",     placeholder: "05 Mar 2026" },
    { key: "category", label: "Categoria",       type: "text",     placeholder: "AI Research" },
    { key: "image",    label: "Copertina (URL)", type: "image",    fullWidth: true },
    { key: "excerpt",  label: "Sommario",        type: "textarea", fullWidth: true, rows: 3, required: true },
  ],
  projects: [
    { key: "title", label: "Titolo",      type: "text",     required: true },
    { key: "image", label: "Immagine (URL)", type: "image", fullWidth: true },
    { key: "desc",  label: "Descrizione", type: "textarea", fullWidth: true, rows: 3 },
    { key: "tech",  label: "Tecnologie",  type: "tags",     fullWidth: true },
  ],
  courses: [
    { key: "title",       label: "Titolo",         type: "text",     required: true },
    { key: "category",    label: "Categoria",       type: "text",     placeholder: "RAG, Agents…" },
    { key: "level",       label: "Livello",         type: "select",   options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
    { key: "modules",     label: "N° Moduli",       type: "number" },
    { key: "image",       label: "Copertina (URL)", type: "image",    fullWidth: true },
    { key: "gradient",    label: "Gradiente CSS",   type: "text",     fullWidth: true, placeholder: "from-red-900 to-red-600" },
    { key: "description", label: "Descrizione",     type: "textarea", fullWidth: true, rows: 3 },
    { key: "videos",      label: "Video (JSON Array)", type: "json",  fullWidth: true },
  ],
  pills: [
    { key: "title",    label: "Titolo",           type: "text",  required: true },
    { key: "category", label: "Categoria",         type: "text",  placeholder: "Models, Ops…" },
    { key: "duration", label: "Durata",            type: "text",  placeholder: "5 min" },
    { key: "image",    label: "Copertina (URL)",   type: "image", fullWidth: true },
    { key: "videos",   label: "Video (JSON Array)", type: "json", fullWidth: true },
  ],
  broadcast: [
    { key: "subject", label: "Oggetto Email", type: "text", fullWidth: true, required: true, placeholder: "Es: Nuovi aggiornamenti su Future Intelligence" },
  ]
};

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; count?: number }> = {
  newsletter: { label: "Newsletter", icon: <Newspaper size={14} /> },
  projects:   { label: "Progetti",   icon: <Hash size={14} /> },
  courses:    { label: "Corsi",      icon: <BookOpen size={14} /> },
  pills:      { label: "Pills",      icon: <Zap size={14} /> },
  broadcast:  { label: "Broadcast",  icon: <Rocket size={14} /> },
};

// ─── Toast system ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300 ${
          t.kind === "success" ? "bg-green-950/90 border-green-800 text-green-400" :
          t.kind === "error"   ? "bg-red-950/90 border-red-800 text-red-400" :
          "bg-zinc-900/90 border-white/10 text-gray-300"
        }`}>
          {t.kind === "success" ? <CheckCircle size={14} /> : t.kind === "error" ? <AlertCircle size={14} /> : <Info size={14} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, danger = false, confirmLabel = "Conferma", onConfirm, onCancel }: {
  title: string; message: string; danger?: boolean; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-white font-black uppercase tracking-widest text-base mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            Annulla
          </button>
          <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            danger ? "bg-red-900 hover:bg-red-700 text-white" : "bg-white text-black hover:bg-gray-200"
          }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Item Modal ───────────────────────────────────────────────────────────
function NewItemModal({ onConfirm, onCancel }: { onConfirm: (slug: string) => void; onCancel: () => void }) {
  const [slug, setSlug] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const sanitize = (v: string) => v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-white font-black uppercase tracking-widest text-base mb-6">Nuovo Contenuto</h3>
        <label className="text-[9px] text-red-700 uppercase tracking-widest font-black block mb-2">Slug (URL-safe) *</label>
        <input
          ref={inputRef}
          value={slug}
          onChange={e => setSlug(sanitize(e.target.value))}
          onKeyDown={e => { if (e.key === "Enter" && slug.length >= 3) onConfirm(slug); if (e.key === "Escape") onCancel(); }}
          placeholder="es: nuovo-articolo-ai"
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-red-900"
        />
        <p className="text-[10px] text-gray-600 mb-6">Lo slug diventa l'URL del contenuto. Solo lettere minuscole, numeri e trattini.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            Annulla
          </button>
          <button
            onClick={() => slug.length >= 3 && onConfirm(slug)}
            disabled={slug.length < 3}
            className="px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Crea Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tag Editor ───────────────────────────────────────────────────────────────
function TagEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const tags = Array.isArray(value) ? value : [];

  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); setInput(""); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-6">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-red-950/40 border border-red-900/40 rounded-lg text-[10px] font-bold text-red-400 uppercase tracking-wider">
            {tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-white transition-colors ml-0.5">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder="Aggiungi tag e premi Enter…"
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-900"
        />
        <button onClick={add} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs hover:bg-red-900 transition-all">
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Image Field ──────────────────────────────────────────────────────────────
function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setShowPreview(false); }}
          placeholder="https://images.unsplash.com/..."
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-900"
        />
        {value && (
          <button onClick={() => setShowPreview(p => !p)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs hover:bg-white/10 transition-all flex items-center gap-1">
            {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        )}
      </div>
      {showPreview && value && (
        <div className="mt-2 relative">
          <img
            src={value} alt="preview"
            className="w-full h-32 object-cover rounded-xl border border-white/5 opacity-80"
            onError={e => { (e.target as HTMLImageElement).src = ""; setShowPreview(false); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl pointer-events-none" />
        </div>
      )}
    </div>
  );
}

// ─── Metadata Form ────────────────────────────────────────────────────────────
function MetadataForm({ type, metadata, onChange }: {
  type: ContentType; metadata: Record<string, any>; onChange: (k: string, v: any) => void;
}) {
  const schema = SCHEMAS[type] || [];
  const inputBase = "w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-900 transition-all";

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {/* Slug — read-only, always shown */}
      <div className="col-span-2">
        <label className="text-[8px] uppercase tracking-widest text-zinc-500 font-black block mb-1.5 flex items-center gap-1.5">
          <Hash size={9} /> Slug (URL)
        </label>
        <input value={metadata.slug || ""} readOnly className={`${inputBase} font-mono opacity-50 cursor-not-allowed`} />
      </div>

      {schema.map(field => {
        const val = metadata[field.key] ?? "";
        const labelEl = (
          <label className={`text-[8px] uppercase tracking-widest font-black block mb-1.5 flex items-center gap-1.5 ${field.required ? "text-red-700" : "text-zinc-500"}`}>
            {field.type === "image" && <ImageIcon size={9} />}
            {field.type === "tags"  && <Tag size={9} />}
            {field.label}
            {field.required && <span className="text-red-600">*</span>}
          </label>
        );

        const el = (() => {
          switch (field.type) {
            case "image":
              return <ImageField value={val} onChange={v => onChange(field.key, v)} />;
            case "tags":
              return <TagEditor value={val} onChange={v => onChange(field.key, v)} />;
            case "textarea":
              return (
                <div className="relative">
                  <textarea
                    rows={field.rows || 3}
                    value={val}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={`${inputBase} resize-none`}
                  />
                  <span className="absolute bottom-2 right-2 text-[8px] text-zinc-600">{String(val).length}</span>
                </div>
              );
            case "json":
              return (
                <textarea
                  rows={4}
                  value={typeof val === "object" ? JSON.stringify(val, null, 2) : val}
                  onChange={e => onChange(field.key, e.target.value)}
                  placeholder={'[\n  { "title": "Video", "url": "https://..." }\n]'}
                  className={`${inputBase} resize-none font-mono text-[10px]`}
                />
              );
            case "number":
              return (
                <input
                  type="number" min={0}
                  value={val}
                  onChange={e => onChange(field.key, Number(e.target.value))}
                  className={inputBase}
                />
              );
            case "select":
              return (
                <select
                  value={val}
                  onChange={e => onChange(field.key, e.target.value)}
                  className={`${inputBase} bg-black/60`}
                >
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              );
            default:
              return (
                <input
                  type="text"
                  value={val}
                  onChange={e => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputBase}
                />
              );
          }
        })();

        return (
          <div key={field.key} className={field.fullWidth ? "col-span-2" : ""}>
            {labelEl}
            {el}
          </div>
        );
      })}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "cerbero2026") { onLogin(pw); }
    else { setShake(true); setTimeout(() => setShake(false), 600); setPw(""); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Rocket size={28} className="text-red-700" />
          <span className="text-white font-black uppercase tracking-widest text-lg">CMS Admin</span>
        </div>
        <form onSubmit={attempt} className={`bg-zinc-950 border border-white/10 rounded-2xl p-8 shadow-2xl transition-transform ${shake ? "animate-bounce" : ""}`}>
          <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black block mb-2">Password</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="••••••••••••"
            autoFocus
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none focus:ring-1 focus:ring-red-900"
          />
          <button type="submit" className="w-full py-3 bg-red-900 text-white font-black rounded-xl uppercase tracking-widest text-sm hover:bg-red-700 transition-all">
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeType, setActiveType] = useState<ContentType>("newsletter");
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editMetadata, setEditMetadata] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Toast helper
  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const loadItems = useCallback(async (type: ContentType) => {
    if (type === "broadcast") {
      setActiveType("broadcast");
      setSelectedItem({ slug: "new-broadcast", isNew: true });
      setEditContent("");
      setEditMetadata({ subject: "" });
      setItems([]);
      setIsDirty(false);
      return;
    }
    setLoading(true);
    setSyncMsg("Sincronizzazione GitHub…");
    try {
      const list = await getContentList(type);
      setItems(list);
      setActiveType(type);
      setSelectedItem(null);
      setIsDirty(false);
    } catch (err: any) {
      toast(err.message || "Errore caricamento", "error");
    } finally {
      setLoading(false);
      setSyncMsg("");
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthorized) loadItems("newsletter");
  }, [isAuthorized, loadItems]);

  const handleMetaChange = (key: string, val: any) => {
    setEditMetadata(prev => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleContentChange = (val: string) => {
    setEditContent(val);
    setIsDirty(true);
  };

  const openItem = (item: any) => {
    const { content, sha, ...meta } = item;
    setSelectedItem(item);
    setEditContent(content || "");
    setEditMetadata({ slug: item.slug, ...meta });
    setIsDirty(false);
  };

  const handleEdit = (item: any) => {
    if (isDirty) {
      setConfirmModal({
        title: "Modifiche non salvate",
        message: "Hai modifiche non salvate. Vuoi continuare senza salvare?",
        onConfirm: () => { setConfirmModal(null); openItem(item); }
      });
      return;
    }
    openItem(item);
  };

  const handleAddNew = async (slug: string) => {
    setShowNewModal(false);
    const defaults = await getDefaults(activeType);
    setSelectedItem({ slug, isNew: true });
    setEditContent("");
    setEditMetadata({ slug, ...defaults });
    setIsDirty(true);
  };

  const handleSendBroadcast = async () => {
    if (!editMetadata.subject || !editContent) {
      toast("Oggetto e contenuto sono obbligatori", "error");
      return;
    }

    setConfirmModal({
      title: "Invia Newsletter",
      message: "Sei sicuro di voler inviare questa email a tutti gli iscritti? L'azione è irreversibile.",
      onConfirm: async () => {
        setConfirmModal(null);
        setLoading(true);
        setSyncMsg("Invio in corso…");
        try {
          const response = await fetch('/api/admin/newsletter/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: editMetadata.subject,
              content: editContent // Qui viene passato il contenuto (che può essere HTML o testo)
            }),
          });
          const data = await response.json();
          if (response.ok) {
            toast(`Newsletter inviata con successo a ${data.count} iscritti!`, "success");
            setIsDirty(false);
          } else {
            toast(data.error || "Errore durante l'invio", "error");
          }
        } catch (err) {
          toast("Errore di connessione", "error");
        } finally {
          setLoading(false);
          setSyncMsg("");
        }
      }
    });
  };

  const handleSave = useCallback(async () => {
    if (!selectedItem) return;
    if (activeType === "broadcast") {
      handleSendBroadcast();
      return;
    }
    setLoading(true);
    setSyncMsg("Pubblicazione in corso…");
    try {
      const { slug, ...metaToSave } = editMetadata;
      let finalMeta = { ...metaToSave };

      // Parse JSON fields
      const jsonFields = ["videos"];
      for (const f of jsonFields) {
        if (typeof finalMeta[f] === "string") {
          try { finalMeta[f] = JSON.parse(finalMeta[f]); }
          catch { toast(`Formato JSON non valido nel campo "${f}"`, "error"); setLoading(false); setSyncMsg(""); return; }
        }
      }

      const result = await saveContent(activeType, selectedItem.slug, editContent, finalMeta);
      if (result.success) {
        toast("Salvato e pubblicato su GitHub!", "success");
        setIsDirty(false);
        await loadItems(activeType);
      } else {
        toast(result.error || "Errore durante il salvataggio", "error");
      }
    } catch (e: any) {
      toast(e.message || "Errore imprevisto", "error");
    } finally {
      setLoading(false);
      setSyncMsg("");
    }
  }, [selectedItem, editMetadata, editContent, activeType, toast, loadItems]);

  // Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && selectedItem && isDirty) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedItem, isDirty, handleSave]);

  const handleDelete = () => {
    if (!selectedItem || selectedItem.isNew) return;
    setConfirmModal({
      title: "Elimina contenuto",
      message: `Stai per eliminare permanentemente "${selectedItem.slug}". Questa azione non può essere annullata.`,
      onConfirm: async () => {
        setConfirmModal(null);
        setLoading(true);
        setSyncMsg("Eliminazione in corso…");
        try {
          const result = await deleteContent(activeType, selectedItem.slug, selectedItem.sha);
          if (result.success) {
            toast("Contenuto eliminato.", "success");
            await loadItems(activeType);
          } else {
            toast(result.error || "Errore eliminazione", "error");
          }
        } catch (e: any) {
          toast(e.message || "Errore", "error");
        } finally {
          setLoading(false);
          setSyncMsg("");
        }
      }
    });
  };

  const handleDiscard = () => {
    if (!isDirty) return;
    setConfirmModal({
      title: "Annulla modifiche",
      message: "Vuoi annullare tutte le modifiche non salvate?",
      onConfirm: () => {
        setConfirmModal(null);
        if (selectedItem?.isNew) { setSelectedItem(null); }
        else { openItem(selectedItem); }
        setIsDirty(false);
      }
    });
  };

  const filteredItems = items.filter(item =>
    (item.title || item.slug).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) return <LoginScreen onLogin={() => setIsAuthorized(true)} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col" data-color-mode="dark">
      <ToastContainer toasts={toasts} />
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          danger
          confirmLabel="Continua"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {showNewModal && (
        <NewItemModal onConfirm={handleAddNew} onCancel={() => setShowNewModal(false)} />
      )}

      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Rocket size={20} className="text-red-700" />
          <span className="text-white font-black uppercase tracking-widest text-sm">CMS</span>
          <div className="w-px h-4 bg-white/10" />
          {(Object.entries(TYPE_META) as [ContentType, any][]).map(([id, meta]) => (
            <button
              key={id}
              onClick={() => loadItems(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeType === id
                  ? "bg-red-900/40 text-red-400 border border-red-900/50"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {meta.icon} {meta.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {syncMsg && (
            <span className="flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase tracking-widest">
              <RefreshCw size={10} className="animate-spin" /> {syncMsg}
            </span>
          )}
          {selectedItem && (
            <>
              {isDirty && (
                <span className="flex items-center gap-1 text-[9px] text-amber-500 uppercase tracking-widest font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Non salvato
                </span>
              )}
              {isDirty && (
                <button onClick={handleDiscard} className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                  Annulla
                </button>
              )}
              {!selectedItem.isNew && (
                <button onClick={handleDelete} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 border border-red-900/30 text-red-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all disabled:opacity-40">
                  <Trash2 size={11} /> Elimina
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading || !isDirty}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Ctrl+S"
              >
                <Save size={11} /> Salva & Pubblica
              </button>
            </>
          )}
        </div>
      </header>

      {/* ─── Body: Sidebar + Editor ───────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 49px)" }}>

        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col bg-black/30">
          <div className="p-3 border-b border-white/5 flex gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cerca…"
                className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-900"
              />
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              title="Aggiungi nuovo"
              className="p-2 bg-white text-black rounded-lg hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading && filteredItems.length === 0 ? (
              <div className="py-8 text-center text-[9px] text-zinc-700 uppercase tracking-widest animate-pulse">Caricamento…</div>
            ) : filteredItems.length === 0 ? (
              <div className="py-8 text-center text-[9px] text-zinc-700 uppercase tracking-widest">Nessun risultato</div>
            ) : filteredItems.map(item => (
              <button
                key={item.slug}
                onClick={() => handleEdit(item)}
                className={`w-full text-left p-3 rounded-xl transition-all border group ${
                  selectedItem?.slug === item.slug
                    ? "bg-red-900/20 border-red-900/50 text-white"
                    : "border-transparent hover:bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[11px] truncate">{item.title || item.slug}</p>
                  <ChevronRight size={10} className={`flex-shrink-0 transition-transform ${selectedItem?.slug === item.slug ? "text-red-500" : "opacity-0 group-hover:opacity-100"}`} />
                </div>
                {item.category && <p className="text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">{item.category}</p>}
                {item.date && <p className="text-[9px] text-zinc-700 mt-0.5">{item.date}</p>}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <p className="text-[9px] text-zinc-700 uppercase tracking-widest text-center">
              {filteredItems.length} {filteredItems.length === 1 ? "elemento" : "elementi"}
            </p>
          </div>
        </aside>

        {/* Editor Area */}
        {!selectedItem ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-700">
            <FileText size={48} strokeWidth={1} />
            <p className="text-xs uppercase tracking-widest font-bold">Seleziona un elemento o crea nuovo</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <Plus size={12} /> Nuovo contenuto
            </button>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">

            {/* Metadata Panel */}
            <div className="w-80 flex-shrink-0 border-r border-white/5 overflow-y-auto bg-black/20">
              <div className="p-4 border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest ${selectedItem.isNew ? "bg-amber-900/40 text-amber-400 border border-amber-900/40" : "bg-green-900/40 text-green-400 border border-green-900/40"}`}>
                    {selectedItem.isNew ? "Draft" : "Pubblicato"}
                  </span>
                  {!selectedItem.isNew && (
                    <a
                      href={`/${activeType === "newsletter" ? "newsletter" : activeType === "projects" ? "projects" : "academy/courses"}/${selectedItem.slug}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-1 text-zinc-600 hover:text-white transition-colors"
                      title="Apri pagina"
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Metadati</h2>
              </div>
              <div className="p-4">
                <MetadataForm
                  type={activeType}
                  metadata={editMetadata}
                  onChange={handleMetaChange}
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-black/20 flex-shrink-0">
                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                  <FileText size={10} className="text-red-700" /> Contenuto
                </label>
                <span className="text-[9px] text-zinc-700 uppercase tracking-widest">Ctrl+S per salvare</span>
              </div>
              <div className="flex-1 overflow-hidden p-3">
                <RichEditor
                  value={editContent}
                  onChange={handleContentChange}
                  placeholder={
                    activeType === "newsletter" ? "Scrivi il contenuto dell'articolo…" :
                    activeType === "broadcast"  ? "Scrivi il corpo dell'email da inviare agli iscritti…" :
                    "Scrivi una descrizione dettagliata…"
                  }
                />
              </div>
              <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-700">
                <span>{editContent.replace(/<[^>]+>/g, "").length} caratteri · {editContent.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length} parole</span>
                <span>HTML salvato su GitHub</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
