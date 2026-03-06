"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Link2, Link2Off, ImageIcon, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Undo2, Redo2,
  Type, Pilcrow,
} from "lucide-react";

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function Btn({
  onClick, active = false, disabled = false, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-all duration-150 flex-shrink-0 ${
        active
          ? "bg-red-900/60 text-red-300 border border-red-800/60"
          : "text-zinc-400 hover:text-white hover:bg-white/10"
      } disabled:opacity-20 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />;
}

// ─── Link Dialog ──────────────────────────────────────────────────────────────
function LinkDialog({ onConfirm, onCancel, initial = "" }: {
  onConfirm: (url: string) => void; onCancel: () => void; initial?: string;
}) {
  const [url, setUrl] = useState(initial);
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-3">Inserisci URL</p>
        <input
          autoFocus
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onConfirm(url); if (e.key === "Escape") onCancel(); }}
          placeholder="https://..."
          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-red-900 font-mono"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white">Annulla</button>
          <button onClick={() => onConfirm(url)} className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Conferma</button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Dialog ─────────────────────────────────────────────────────────────
function ImageDialog({ onConfirm, onCancel }: {
  onConfirm: (url: string, alt: string) => void; onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-4">Inserisci Immagine</p>
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-1">URL Immagine *</label>
            <input
              autoFocus
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs mb-1 focus:outline-none focus:ring-1 focus:ring-red-900 font-mono"
            />
            {url && (
              <img src={url} alt="preview" className="w-full h-24 object-cover rounded-lg mt-2 border border-white/5 opacity-70"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
          <div>
            <label className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-1">Alt text (accessibilità)</label>
            <input
              value={alt}
              onChange={e => setAlt(e.target.value)}
              placeholder="Descrizione immagine…"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-900"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white">Annulla</button>
          <button onClick={() => url && onConfirm(url, alt)} disabled={!url} className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">Inserisci</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function RichEditor({
  value,
  onChange,
  placeholder = "Inizia a scrivere…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [linkDialog, setLinkDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "not-prose" } },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "rich-link", target: "_blank", rel: "noopener noreferrer" } }),
      Image.configure({ HTMLAttributes: { class: "rich-image" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none min-h-[200px] px-6 py-5 text-sm text-zinc-200 leading-relaxed",
      },
    },
  });

  // Sync editor content when value changes externally (e.g. switching items)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // Avoid loop: only setContent if actually different
    if (current !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const insertLink = useCallback((url: string) => {
    setLinkDialog(false);
    if (!editor) return;
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback((url: string, alt: string) => {
    setImageDialog(false);
    editor?.chain().focus().setImage({ src: url, alt }).run();
  }, [editor]);

  if (!editor) return null;

  const currentLink = editor.getAttributes("link").href ?? "";

  return (
    <>
      {linkDialog && (
        <LinkDialog initial={currentLink} onConfirm={insertLink} onCancel={() => setLinkDialog(false)} />
      )}
      {imageDialog && (
        <ImageDialog onConfirm={insertImage} onCancel={() => setImageDialog(false)} />
      )}

      <div className="flex flex-col h-full border border-white/5 rounded-xl overflow-hidden bg-zinc-950/60">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/5 bg-black/40 flex-shrink-0">

          {/* History */}
          <Btn title="Annulla (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2 size={13} />
          </Btn>
          <Btn title="Ripeti (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2 size={13} />
          </Btn>

          <Divider />

          {/* Headings */}
          <Btn title="Titolo H1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 size={13} />
          </Btn>
          <Btn title="Titolo H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 size={13} />
          </Btn>
          <Btn title="Titolo H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 size={13} />
          </Btn>
          <Btn title="Paragrafo" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
            <Pilcrow size={13} />
          </Btn>

          <Divider />

          {/* Inline formatting */}
          <Btn title="Grassetto (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={13} />
          </Btn>
          <Btn title="Corsivo (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={13} />
          </Btn>
          <Btn title="Sottolineato (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon size={13} />
          </Btn>
          <Btn title="Barrato" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough size={13} />
          </Btn>
          <Btn title="Codice inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code size={13} />
          </Btn>

          <Divider />

          {/* Lists */}
          <Btn title="Lista puntata" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List size={13} />
          </Btn>
          <Btn title="Lista numerata" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered size={13} />
          </Btn>
          <Btn title="Citazione" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote size={13} />
          </Btn>
          <Btn title="Blocco codice" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 size={13} />
          </Btn>
          <Btn title="Separatore orizzontale" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus size={13} />
          </Btn>

          <Divider />

          {/* Alignment */}
          <Btn title="Allinea sinistra" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <AlignLeft size={13} />
          </Btn>
          <Btn title="Centra" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <AlignCenter size={13} />
          </Btn>
          <Btn title="Allinea destra" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <AlignRight size={13} />
          </Btn>
          <Btn title="Giustifica" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            <AlignJustify size={13} />
          </Btn>

          <Divider />

          {/* Link & Image */}
          <Btn title="Inserisci / modifica link" active={editor.isActive("link")} onClick={() => setLinkDialog(true)}>
            <Link2 size={13} />
          </Btn>
          {editor.isActive("link") && (
            <Btn title="Rimuovi link" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Link2Off size={13} />
            </Btn>
          )}
          <Btn title="Inserisci immagine" onClick={() => setImageDialog(true)}>
            <ImageIcon size={13} />
          </Btn>
        </div>

        {/* ── Editor content ── */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </>
  );
}
