import { useEffect, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

// Keep in sync with the backend's allowed tags (location_challenges/rich_text.py):
// anything else is stripped on save.
const EMPTY_HTML = "<p></p>";

const ToolbarToggle = ({
  pressed,
  onPress,
  label,
  children,
}: {
  pressed: boolean;
  onPress: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <Toggle
    size="sm"
    pressed={pressed}
    onPressedChange={onPress}
    aria-label={label}
    title={label}
    className="h-8 w-8 p-0"
  >
    {children}
  </Toggle>
);

const LinkButton = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const apply = () => {
    const href = url.trim();
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const withScheme = /^(https?:|mailto:)/i.test(href) ? href : `https://${href}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: withScheme }).run();
    }
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor.getAttributes("link").href ?? "");
      }}
    >
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          aria-label="Link"
          title="Link"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-2" align="start">
        <Input
          autoFocus
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          {editor.isActive("link") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                setOpen(false);
              }}
            >
              <Unlink className="h-4 w-4 mr-1" /> Remove
            </Button>
          )}
          <Button type="button" size="sm" onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
    <ToolbarToggle label="Bold" pressed={editor.isActive("bold")} onPress={() => editor.chain().focus().toggleBold().run()}>
      <Bold className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Italic" pressed={editor.isActive("italic")} onPress={() => editor.chain().focus().toggleItalic().run()}>
      <Italic className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Underline" pressed={editor.isActive("underline")} onPress={() => editor.chain().focus().toggleUnderline().run()}>
      <UnderlineIcon className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Strikethrough" pressed={editor.isActive("strike")} onPress={() => editor.chain().focus().toggleStrike().run()}>
      <Strikethrough className="h-4 w-4" />
    </ToolbarToggle>
    <span className="mx-1 h-5 w-px bg-border" />
    <ToolbarToggle label="Heading" pressed={editor.isActive("heading", { level: 2 })} onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
      <Heading2 className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Subheading" pressed={editor.isActive("heading", { level: 3 })} onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
      <Heading3 className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Bulleted list" pressed={editor.isActive("bulletList")} onPress={() => editor.chain().focus().toggleBulletList().run()}>
      <List className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Numbered list" pressed={editor.isActive("orderedList")} onPress={() => editor.chain().focus().toggleOrderedList().run()}>
      <ListOrdered className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Quote" pressed={editor.isActive("blockquote")} onPress={() => editor.chain().focus().toggleBlockquote().run()}>
      <Quote className="h-4 w-4" />
    </ToolbarToggle>
    <ToolbarToggle label="Divider" pressed={false} onPress={() => editor.chain().focus().setHorizontalRule().run()}>
      <Minus className="h-4 w-4" />
    </ToolbarToggle>
    <LinkButton editor={editor} />
    <span className="mx-1 h-5 w-px bg-border" />
    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo" aria-label="Undo"
      disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
      <Undo className="h-4 w-4" />
    </Button>
    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Redo" aria-label="Redo"
      disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
      <Redo className="h-4 w-4" />
    </Button>
  </div>
);

interface RichTextEditorProps {
  /** HTML. Empty string means no content. */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, code: false, codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { target: "_blank" } }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      onChange(html === EMPTY_HTML ? "" : html);
    },
  });

  // Load new content when the form is reset (e.g. editing a different event).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || EMPTY_HTML) !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      <Toolbar editor={editor} />
      <div className="relative">
        {editor.isEmpty && placeholder && (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
