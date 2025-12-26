import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, Highlighter, List, ListOrdered } from "lucide-react";
import Highlight from "@tiptap/extension-highlight";


export default function TipTapEditor({ value, onChange, height = "200px" }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({
        multicolor: true, // allows different colors later
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full min-h-[150px] p-3",
      },
    },
  });


  if (!editor) return null;

  return (
    <div className="w-full border rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </button>

        <button
          className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </button>

        <button
          className={`p-1 rounded ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={18} />
        </button>

        <button
          className={`p-1 rounded ${editor.isActive("highlight") ? "bg-yellow-300" : ""
            }`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={18} />
        </button>


        <button
          className="p-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </button>

        <button
          className="p-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </button>

        <button
          className="p-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </button>
      </div>

      {/* Editor */}
      <div style={{ minHeight: height }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
