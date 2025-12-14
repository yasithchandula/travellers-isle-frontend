import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

export default function DescriptionEditor({ initialHTML = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      Link.configure({ openOnClick: false }),
      BulletList, OrderedList, ListItem,
    ],
    content: initialHTML || "<p>Write the day description…</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none border rounded px-3 py-2 focus:outline-none min-h-[160px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Keep in sync when parent resets content
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (normalize(current) !== normalize(initialHTML || "")) {
      editor.commands.setContent(initialHTML || "", false, { preserveWhitespace: "full" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHTML, editor]);

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }) {
  const btn = (active, onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-sm border rounded ${active ? "bg-gray-200" : "bg-white"} hover:bg-gray-100`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2 mb-2">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "B")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "I")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), "U")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3")}
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "• List")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "1. List")}
      {btn(false, () => editor.chain().focus().setParagraph().run(), "P")}
      {btn(false, () => editor.chain().focus().unsetAllMarks().clearNodes().run(), "Clear")}
    </div>
  );
}

function normalize(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}
