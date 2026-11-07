import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/location/EventBrandingFields";
import {
  COMPETITION_CATEGORIES,
  type CompetitionCategory,
} from "@/lib/locationChallengesAdminApi";

export interface CompetitionDetails {
  titleShort: string;
  locationsText: string;
  locationShortName: string;
  sponsorName: string;
  sponsorIconUrl: string;
  badgeName: string;
  badgeIconUrl: string;
  /** Prize per selected category, as typed (dollars). */
  prizes: Partial<Record<CompetitionCategory, string>>;
}

export const EMPTY_COMPETITION_DETAILS: CompetitionDetails = {
  titleShort: "",
  locationsText: "",
  locationShortName: "",
  sponsorName: "",
  sponsorIconUrl: "",
  badgeName: "",
  badgeIconUrl: "",
  prizes: {},
};

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);

/** Total of the valid prize amounts, for the live preview. */
export const prizeTotal = (prizes: CompetitionDetails["prizes"]) =>
  Object.values(prizes).reduce((sum, text) => {
    const n = Number(text);
    return Number.isFinite(n) && n >= 0 ? sum + n : sum;
  }, 0);

const CompetitionFields = ({
  value,
  onChange,
}: {
  value: CompetitionDetails;
  onChange: (value: CompetitionDetails) => void;
}) => {
  // Uploads resolve later; merge into the latest value, not the one at click time.
  const valueRef = useRef(value);
  valueRef.current = value;
  const patch = (changes: Partial<CompetitionDetails>) => onChange({ ...valueRef.current, ...changes });

  const toggleCategory = (category: CompetitionCategory, on: boolean) => {
    const prizes = { ...valueRef.current.prizes };
    if (on) prizes[category] = prizes[category] ?? "";
    else delete prizes[category];
    patch({ prizes });
  };

  return (
    <div className="space-y-4 rounded-md border p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="competition-title-short">Title short</Label>
          <Input
            id="competition-title-short"
            placeholder="e.g. USVI Competition"
            value={value.titleShort}
            onChange={(e) => patch({ titleShort: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="competition-location-short">Physical location short name</Label>
          <Input
            id="competition-location-short"
            placeholder="e.g. USVI"
            value={value.locationShortName}
            onChange={(e) => patch({ locationShortName: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="competition-locations-text">Locations (shown in the app)</Label>
        <Input
          id="competition-locations-text"
          placeholder="e.g. St. Thomas, St. John and St. Croix"
          value={value.locationsText}
          onChange={(e) => patch({ locationsText: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Categories and prizes</Label>
        <p className="text-xs text-muted-foreground">
          Tick each category in this competition and set its prize. Artists can only join if their
          talent is one of the ticked categories.
        </p>
        <div className="space-y-2">
          {COMPETITION_CATEGORIES.map((category) => {
            const selected = category in value.prizes;
            const id = `competition-category-${category.replace(/\W+/g, "-")}`;
            return (
              <div key={category} className="flex items-center gap-3">
                <Checkbox
                  id={id}
                  checked={selected}
                  onCheckedChange={(checked) => toggleCategory(category, checked === true)}
                />
                <Label htmlFor={id} className="w-32 font-normal">
                  {category}
                </Label>
                {selected && (
                  <div className="relative w-36">
                    <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground">$</span>
                    <Input
                      aria-label={`${category} prize`}
                      inputMode="decimal"
                      className="pl-6"
                      placeholder="250"
                      value={value.prizes[category] ?? ""}
                      onChange={(e) =>
                        patch({
                          prizes: {
                            ...valueRef.current.prizes,
                            [category]: e.target.value.replace(/[^\d.]/g, ""),
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm">
          Total prize: <strong>{formatUsd(prizeTotal(value.prizes))}</strong>
          <span className="text-xs text-muted-foreground"> (sum of the category prizes)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="competition-sponsor">Sponsor name</Label>
            <Input
              id="competition-sponsor"
              placeholder="e.g. King of the Wing Foundation Inc."
              value={value.sponsorName}
              onChange={(e) => patch({ sponsorName: e.target.value })}
            />
          </div>
          <ImageUploadField
            kind="sponsor_icon"
            label="Sponsor logo"
            hint="PNG, JPEG, WebP or GIF, up to 2 MB."
            value={value.sponsorIconUrl}
            onChange={(sponsorIconUrl) => patch({ sponsorIconUrl })}
            previewClassName="h-14 w-14"
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="competition-badge">Profile badge name</Label>
            <Input
              id="competition-badge"
              placeholder="e.g. USVI"
              value={value.badgeName}
              onChange={(e) => patch({ badgeName: e.target.value })}
            />
          </div>
          <ImageUploadField
            kind="badge_icon"
            label="Badge icon"
            hint="Shown on joined artists' profiles. Square, up to 2 MB."
            value={value.badgeIconUrl}
            onChange={(badgeIconUrl) => patch({ badgeIconUrl })}
            previewClassName="h-14 w-14"
          />
        </div>
      </div>
    </div>
  );
};

export default CompetitionFields;
