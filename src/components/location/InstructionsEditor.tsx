import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadEventImage } from "@/lib/locationChallengesAdminApi";

export interface InstructionDraft {
  /** Client-side key only; the backend replaces the whole list on save. */
  key: string;
  text: string;
  iconUrl: string;
}

const MAX_INSTRUCTIONS = 20;
const MAX_TEXT = 500;
const MAX_ICON_BYTES = 2 * 1024 * 1024;

let keySeq = 0;
const nextKey = () => `instruction-${Date.now()}-${keySeq++}`;

const IconUpload = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_ICON_BYTES) {
      toast.error("Instruction icon must be smaller than 2 MB.");
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadEventImage(file, "instruction_icon"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        title={value ? "Replace icon" : "Upload icon"}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-muted hover:bg-accent"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {value && !uploading && (
        <button
          type="button"
          title="Remove icon"
          className="absolute -right-1.5 -top-1.5 rounded-full border bg-background p-0.5 hover:bg-accent"
          onClick={() => onChange("")}
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

const InstructionsEditor = ({
  value,
  onChange,
}: {
  value: InstructionDraft[];
  onChange: (value: InstructionDraft[]) => void;
}) => {
  // Icon uploads resolve later; apply them to the latest list.
  const valueRef = useRef(value);
  valueRef.current = value;

  const update = (key: string, changes: Partial<InstructionDraft>) =>
    onChange(valueRef.current.map((item) => (item.key === key ? { ...item, ...changes } : item)));

  const move = (index: number, delta: number) => {
    const next = [...value];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Instructions</Label>
        <span className="text-xs text-muted-foreground">
          {value.length}/{MAX_INSTRUCTIONS} · shown in this order
        </span>
      </div>

      {value.length === 0 && (
        <p className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
          No instructions yet. Add the steps users should follow.
        </p>
      )}

      <ol className="space-y-2">
        {value.map((item, index) => (
          <li key={item.key} className="flex items-center gap-2 rounded-md border p-2">
            <span className="w-5 shrink-0 text-center text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <IconUpload value={item.iconUrl} onChange={(iconUrl) => update(item.key, { iconUrl })} />
            <Input
              placeholder="e.g. Turn on location so we can confirm you're in the area"
              maxLength={MAX_TEXT}
              value={item.text}
              onChange={(e) => update(item.key, { text: e.target.value })}
            />
            <div className="flex shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Move up"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Move down"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Delete"
                onClick={() => onChange(value.filter((i) => i.key !== item.key))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={value.length >= MAX_INSTRUCTIONS}
        onClick={() => onChange([...value, { key: nextKey(), text: "", iconUrl: "" }])}
      >
        <Plus className="h-4 w-4 mr-1" /> Add instruction
      </Button>
    </div>
  );
};

export default InstructionsEditor;
