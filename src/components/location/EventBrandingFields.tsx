import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadEventImage, type EventImageKind } from "@/lib/locationChallengesAdminApi";

export interface EventBranding {
  themeColor: string;
  iconUrl: string;
  imageUrl: string;
}

const PRESET_COLORS = [
  "#DC2626", "#EA580C", "#D97706", "#16A34A",
  "#0D9488", "#0EA5E9", "#2563EB", "#7C3AED",
  "#DB2777", "#111827",
];

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES: Record<EventImageKind, number> = {
  icon: 2 * 1024 * 1024,
  image: 10 * 1024 * 1024,
};

const ImageUploadField = ({
  kind,
  label,
  hint,
  value,
  onChange,
  previewClassName,
}: {
  kind: EventImageKind;
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  previewClassName: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES[kind]) {
      toast.error(`${label} must be smaller than ${MAX_BYTES[kind] / (1024 * 1024)} MB.`);
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadEventImage(file, kind));
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted",
            previewClassName
          )}
        >
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="ml-1.5">{value ? "Replace" : "Upload"}</span>
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => onChange("")}
              >
                <Trash2 className="h-4 w-4" />
                <span className="ml-1.5">Remove</span>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

const EventBrandingFields = ({
  value,
  onChange,
}: {
  value: EventBranding;
  onChange: (value: EventBranding) => void;
}) => {
  const [colorText, setColorText] = useState(value.themeColor);
  const validColor = HEX_COLOR.test(value.themeColor);
  // Uploads resolve later; merge into the latest value, not the one at click time.
  const valueRef = useRef(value);
  valueRef.current = value;
  const patch = (changes: Partial<EventBranding>) => onChange({ ...valueRef.current, ...changes });

  const setColor = (hex: string) => {
    setColorText(hex);
    patch({ themeColor: hex.toUpperCase() });
  };

  return (
    <div className="space-y-4 rounded-md border p-3">
      <div className="space-y-2">
        <Label htmlFor="event-color">Theme color</Label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`Use ${hex}`}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition",
                value.themeColor.toUpperCase() === hex ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: hex }}
              onClick={() => setColor(hex)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label="Pick a custom color"
            className="h-9 w-12 cursor-pointer rounded-md border bg-transparent p-1"
            value={validColor ? value.themeColor : "#2563EB"}
            onChange={(e) => setColor(e.target.value)}
          />
          <Input
            id="event-color"
            className="w-32 font-mono uppercase"
            placeholder="#2563EB"
            maxLength={7}
            value={colorText}
            onChange={(e) => {
              const text = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              setColorText(text === "#" ? "" : text);
              patch({ themeColor: text === "#" ? "" : text.toUpperCase() });
            }}
          />
          {value.themeColor && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setColor("")}>
              Clear
            </Button>
          )}
        </div>
        {value.themeColor && !validColor && (
          <p className="text-xs text-destructive">Use a 6-digit hex color like #2563EB.</p>
        )}
      </div>

      <ImageUploadField
        kind="icon"
        label="Icon"
        hint="Square PNG, JPEG, WebP or GIF, up to 2 MB."
        value={value.iconUrl}
        onChange={(iconUrl) => patch({ iconUrl })}
        previewClassName="h-14 w-14"
      />

      <ImageUploadField
        kind="image"
        label="Cover image"
        hint="Wide banner, PNG, JPEG, WebP or GIF, up to 10 MB."
        value={value.imageUrl}
        onChange={(imageUrl) => patch({ imageUrl })}
        previewClassName="h-14 w-28"
      />
    </div>
  );
};

export default EventBrandingFields;
