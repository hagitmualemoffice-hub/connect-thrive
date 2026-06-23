import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder || "כתבי כאן..." }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        dir: "rtl",
        class:
          "prose prose-base max-w-none min-h-[400px] focus:outline-none text-right p-6 text-foreground/85 font-light leading-loose",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("הכנס קישור (https://...)");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const onPickImage = () => fileRef.current?.click();
  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file, { contentType: file.type });
    if (error) {
      toast.error("העלאה נכשלה: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
  };

  const btnCls = "h-8 px-2 text-xs";
  return (
    <div className="border rounded-lg bg-card" dir="rtl">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <Button type="button" variant={editor.isActive("bold") ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("italic") ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("bulletList") ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("orderedList") ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant={editor.isActive("blockquote") ? "default" : "ghost"} size="sm" className={btnCls} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className={btnCls} onClick={addLink}><LinkIcon className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className={btnCls} onClick={onPickImage}><ImageIcon className="h-3.5 w-3.5" /></Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadImage(f);
            e.target.value = "";
          }}
        />
        <div className="mr-auto flex gap-1">
          <Button type="button" variant="ghost" size="sm" className={btnCls} onClick={() => editor.chain().focus().undo().run()}><Undo className="h-3.5 w-3.5" /></Button>
          <Button type="button" variant="ghost" size="sm" className={btnCls} onClick={() => editor.chain().focus().redo().run()}><Redo className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
