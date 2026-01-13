"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link2,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Code2,
    Palette,
    Minus,
    Eraser,
} from "lucide-react";
import { useCallback, useState } from "react";
import { PostApi } from "@/api/post.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    uploadFolder?: string; // Optional folder for image uploads (e.g., "posts" or "products")
}

export default function RichTextEditor({ value, onChange, placeholder, className, uploadFolder = "posts" }: RichTextEditorProps) {
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showColorPicker, setShowColorPicker] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable default code block, use lowlight version
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline hover:text-blue-800",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg my-4",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: placeholder || "Bắt đầu viết nội dung của bạn...",
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm",
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-6",
            },
        },
    });

    // Upload image handler
    const handleImageUpload = useCallback(async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                setIsUploadingImage(true);
                const result = await PostApi.uploadImageFromFile(file, uploadFolder);
                if (result.success && editor) {
                    editor.chain().focus().setImage({ src: result.data.url }).run();
                    toast.success("Upload ảnh thành công");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Upload ảnh thất bại");
            } finally {
                setIsUploadingImage(false);
            }
        };
        input.click();
    }, [editor, uploadFolder]);

    // Add link handler
    const handleAddLink = useCallback(() => {
        if (!linkUrl) {
            editor?.chain().focus().unsetLink().run();
            setShowLinkDialog(false);
            return;
        }

        const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
        editor?.chain().focus().setLink({ href: url }).run();
        setShowLinkDialog(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-600"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {children}
        </button>
    );

    const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000"];

    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white ${className}`}>
            {/* Toolbar */}
            <div className="border-b border-slate-200 bg-slate-50 p-2 sticky top-0 z-10">
                <div className="flex flex-wrap gap-1">
                    {/* Text formatting */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold (Ctrl+B)">
                            <Bold className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic (Ctrl+I)">
                            <Italic className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline (Ctrl+U)">
                            <UnderlineIcon className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
                            <Strikethrough className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Inline Code">
                            <Code className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Headings */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Heading 1">
                            <Heading1 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2">
                            <Heading2 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="Heading 3">
                            <Heading3 className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Lists & Quote */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List">
                            <List className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List">
                            <ListOrdered className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote">
                            <Quote className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block">
                            <Code2 className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
                            <AlignLeft className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
                            <AlignCenter className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
                            <AlignRight className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })} title="Justify">
                            <AlignJustify className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Media & Links */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => setShowLinkDialog(!showLinkDialog)} isActive={editor.isActive("link")} title="Add Link">
                            <Link2 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={handleImageUpload} disabled={isUploadingImage} title="Upload Image">
                            <ImageIcon className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Color */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2 relative">
                        <ToolbarButton onClick={() => setShowColorPicker(!showColorPicker)} title="Text Color">
                            <Palette className="h-4 w-4" />
                        </ToolbarButton>
                        {showColorPicker && (
                            <div className="absolute top-12 left-0 bg-white border border-slate-200 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1 z-20">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run();
                                            setShowColorPicker(false);
                                        }}
                                        className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Utilities */}
                    <div className="flex gap-1 border-r border-slate-300 pr-2">
                        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
                            <Minus className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
                            <Eraser className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Undo/Redo */}
                    <div className="flex gap-1">
                        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
                            <Undo className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
                            <Redo className="h-4 w-4" />
                        </ToolbarButton>
                    </div>
                </div>

                {/* Link Dialog */}
                {showLinkDialog && (
                    <div className="mt-2 flex gap-2 items-center p-2 bg-white rounded-lg border border-slate-200">
                        <Input
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddLink();
                                }
                            }}
                            className="flex-1"
                        />
                        <Button type="button" size="sm" onClick={handleAddLink}>
                            Thêm
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setShowLinkDialog(false);
                                setLinkUrl("");
                            }}
                        >
                            Hủy
                        </Button>
                    </div>
                )}
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="bg-white" />

            {/* Character count */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 flex justify-between items-center">
                <span>
                    {editor.storage.characterCount?.characters() || 0} ký tự · {editor.storage.characterCount?.words() || 0} từ
                </span>
                {isUploadingImage && <span className="text-blue-600 animate-pulse">Đang upload ảnh...</span>}
            </div>
        </div>
    );
}
