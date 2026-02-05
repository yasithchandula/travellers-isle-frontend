import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
} from "lucide-react";

export default function TipTapEditor({
  value,
  onChange,
  height = "200px",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    // 🔥 REQUIRED for toolbar active state updates
    shouldRerenderOnTransaction: true,

    // 🔥 Ensure initial selection exists
    onCreate({ editor }) {
      editor.commands.focus("start");
    },

    editorProps: {
      attributes: {
        class:
          "focus:outline-none w-full min-h-[150px] p-3 prose prose-sm max-w-none",
      },
    },
  });

  /* =====================
     🔥 SYNC VALUE ON EDIT
     ===================== */
  useEffect(() => {
    if (!editor) return;

    const incoming = value || "";
    const current = editor.getHTML();

    // prevent infinite loop & cursor jump
    if (current !== incoming) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  function action(fn) {
    return (e) => {
      e.preventDefault();
      editor.commands.focus();
      fn();
    };
  }

  return (
    <div className="w-full border rounded-lg bg-white">
      {/* ================= TOOLBAR ================= */}
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().toggleBold().run()
          )}
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().toggleItalic().run()
          )}
        >
          <Italic size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().toggleUnderline().run()
          )}
        >
          <UnderlineIcon size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive("highlight")
              ? "bg-yellow-300"
              : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().toggleHighlight().run()
          )}
        >
          <Highlighter size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-300"
              : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().setTextAlign("left").run()
          )}
        >
          <AlignLeft size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-300"
              : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().setTextAlign("center").run()
          )}
        >
          <AlignCenter size={18} />
        </button>

        <button
          type="button"
          className={`p-1 rounded ${
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-300"
              : ""
          }`}
          onMouseDown={action(() =>
            editor.chain().setTextAlign("right").run()
          )}
        >
          <AlignRight size={18} />
        </button>
      </div>

      {/* ================= EDITOR ================= */}
      <div
        style={{ minHeight: height }}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            e.target.closest("[contenteditable]")
          ) {
            e.stopPropagation();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
