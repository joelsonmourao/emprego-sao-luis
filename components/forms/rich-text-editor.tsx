"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Eye, Italic, Link2, List, ListOrdered, Pilcrow, RemoveFormatting, Type } from "lucide-react";

import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 280
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank"
        }
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Escreva aqui..."
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[280px] px-4 py-4 text-sm leading-7 text-slate-900 outline-none"
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  const previewHtml = useMemo(() => sanitizeRichTextHtml(value), [value]);

  function toggleLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Cole o link", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    if (!url || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const buttonClass =
    "inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor}>
          <Bold className="h-4 w-4" />
          Negrito
        </button>
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor}>
          <Italic className="h-4 w-4" />
          Italico
        </button>
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} disabled={!editor}>
          <Type className="h-4 w-4" />
          Subtitulo
        </button>
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().setParagraph().run()} disabled={!editor}>
          <Pilcrow className="h-4 w-4" />
          Paragrafo
        </button>
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor}>
          <List className="h-4 w-4" />
          Lista
        </button>
        <button type="button" className={buttonClass} onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor}>
          <ListOrdered className="h-4 w-4" />
          Lista numerada
        </button>
        <button type="button" className={buttonClass} onClick={toggleLink} disabled={!editor}>
          <Link2 className="h-4 w-4" />
          Link
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
          disabled={!editor}
        >
          <RemoveFormatting className="h-4 w-4" />
          Limpar
        </button>
        <button
          type="button"
          className={cn(buttonClass, showPreview ? "border-sky-300 bg-sky-50 text-sky-700" : "")}
          onClick={() => setShowPreview((current) => !current)}
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Ocultar preview" : "Preview"}
        </button>
      </div>

      <div className={cn("grid gap-0", showPreview ? "lg:grid-cols-2" : "grid-cols-1")}>
        <div className="rounded-b-[1.5rem]" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
        {showPreview ? (
          <div className="border-t border-slate-200 bg-slate-50 p-4 lg:border-l lg:border-t-0">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Preview</div>
            <div
              className="prose-content min-h-[240px] rounded-[1.25rem] bg-white p-4 text-sm text-slate-700 shadow-sm"
              dangerouslySetInnerHTML={{ __html: previewHtml || "<p>O preview aparece aqui.</p>" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
