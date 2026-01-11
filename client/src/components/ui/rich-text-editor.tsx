"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    List, 
    ListOrdered, 
    Heading1, 
    Heading2, 
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false, // Fix SSR hydration issue with Next.js
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Nhập URL:", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn("rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
                {/* Text styles */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("bold") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("italic") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("underline") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

                {/* Headings */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("heading", { level: 3 }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

                {/* Alignment */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive({ textAlign: "left" }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive({ textAlign: "center" }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive({ textAlign: "right" }) && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

                {/* Link */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", editor.isActive("link") && "bg-slate-200 dark:bg-slate-700")}
                    onClick={setLink}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

                {/* Undo/Redo */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor content */}
            <div className="min-h-[200px]">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
        </div>
    );
}
