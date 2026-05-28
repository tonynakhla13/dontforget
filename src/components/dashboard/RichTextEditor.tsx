"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

const COLORS = [
  { label: "White",   hex: "#ffffff" },
  { label: "Muted",   hex: "#a3a3a3" },
  { label: "Dim",     hex: "#71717a" },
  { label: "Green",   hex: "#3ABF8A" },
  { label: "Teal",    hex: "#22d3ee" },
  { label: "Amber",   hex: "#f59e0b" },
  { label: "Orange",  hex: "#f97316" },
  { label: "Red",     hex: "#ef4444" },
  { label: "Purple",  hex: "#8b5cf6" },
  { label: "Pink",    hex: "#ec4899" },
];

const HIGHLIGHT_COLORS = [
  { label: "Green",  hex: "#3ABF8A33" },
  { label: "Amber",  hex: "#f59e0b33" },
  { label: "Purple", hex: "#8b5cf633" },
  { label: "Red",    hex: "#ef444433" },
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function Btn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`text-xs px-2 py-1 rounded transition-all select-none ${
        active
          ? "bg-[#3ABF8A]/20 text-[#3ABF8A]"
          : "text-white/45 hover:text-white hover:bg-white/[0.07]"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-4 bg-white/[0.08] mx-0.5 shrink-0" />;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = "120px" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content outline-none",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  // Sync external value changes (e.g. when initial data loads)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const heading = editor.isActive("heading", { level: 1 })
    ? "1"
    : editor.isActive("heading", { level: 2 })
    ? "2"
    : editor.isActive("heading", { level: 3 })
    ? "3"
    : "p";

  return (
    <>
      <style>{`
        .rte-content { min-height: ${minHeight}; padding: 12px 16px; }
        .rte-content:empty:before { content: attr(data-placeholder); color: rgba(255,255,255,0.18); pointer-events: none; }
        .rte-content p { margin: 0 0 0.5em; }
        .rte-content h1 { font-size: 1.5em; font-weight: 700; margin: 0 0 0.4em; }
        .rte-content h2 { font-size: 1.25em; font-weight: 600; margin: 0 0 0.4em; }
        .rte-content h3 { font-size: 1.1em; font-weight: 600; margin: 0 0 0.4em; }
        .rte-content ul { list-style: disc; padding-left: 1.4em; margin: 0 0 0.5em; }
        .rte-content ol { list-style: decimal; padding-left: 1.4em; margin: 0 0 0.5em; }
        .rte-content li { margin: 0.15em 0; }
        .rte-content strong { font-weight: 700; }
        .rte-content em { font-style: italic; }
        .rte-content u { text-decoration: underline; }
        .rte-content mark { border-radius: 2px; padding: 0 2px; }
        .rte-content .ProseMirror-selectednode { outline: 1px solid #3ABF8A; }
      `}</style>

      <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.03]">
        {/* Toolbar */}
        <div className="border-b border-white/[0.08] px-3 py-2 flex flex-wrap gap-1 items-center bg-zinc-900/60">
          {/* Text type */}
          <select
            className="bg-white/5 text-white/55 text-xs border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[#2ea876] transition-colors"
            value={heading}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 }).run();
            }}
          >
            <option value="p">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>

          <Sep />

          <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
            <strong>B</strong>
          </Btn>
          <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
            <em>I</em>
          </Btn>
          <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
            <u>U</u>
          </Btn>

          <Sep />

          <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
            ⬛▬▬
          </Btn>
          <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Center">
            ▬⬛▬
          </Btn>
          <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
            ▬▬⬛
          </Btn>

          <Sep />

          <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
            • list
          </Btn>
          <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
            1. list
          </Btn>

          <Sep />

          {/* Text color */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/25 mr-0.5">A</span>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setColor(c.hex).run();
                }}
                className="w-3.5 h-3.5 rounded-full border border-white/20 hover:scale-125 transition-transform shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
              type="button"
              title="Remove color"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetColor().run();
              }}
              className="w-3.5 h-3.5 rounded-full border border-white/20 hover:scale-125 transition-transform text-white/30 text-[9px] flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <Sep />

          {/* Highlight */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/25 mr-0.5">▓</span>
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={`Highlight ${c.label}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHighlight({ color: c.hex }).run();
                }}
                className="w-3.5 h-3.5 rounded border border-white/20 hover:scale-125 transition-transform shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
              type="button"
              title="Remove highlight"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetHighlight().run();
              }}
              className="w-3.5 h-3.5 rounded border border-white/20 hover:scale-125 transition-transform text-white/30 text-[9px] flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} className="text-white/85 text-sm leading-relaxed" />
      </div>
    </>
  );
}
