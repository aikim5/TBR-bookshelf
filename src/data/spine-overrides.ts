// Visual-only properties that live in the app rather than Notion.
// Keyed by exact book title as it appears in the Notion database.
// When coverColor is set, it takes priority and skips automatic color extraction.
// Omit coverColor to let the app extract the dominant color from the cover image.
export const spineOverrides: Record<string, {
  coverColor?: string;
  spineHeight?: number;
  spineWidth?: number;
}> = {
  "The Obstacle is the Way": { coverColor: "#B73738" },
  "101 Essays That Will Change The Way You Think": {
    coverColor: "#FFFFFF",
    spineHeight: 352,
  },
  Flow: { coverColor: "#EBEC0D", spineHeight: 300 },
  "Know My Name": { coverColor: "#1C545C" },
  "The Lantern of Lost Memories": { coverColor: "#549CA4", spineHeight: 345 },
  "Shoko's Smile": { coverColor: "#EDE8E0", spineHeight: 295 },
  "Project Hail Mary": { coverColor: "#2A3038", spineHeight: 320 },
  Gifted: { coverColor: "#000000" },
  "The Shape of Design": { coverColor: "#6C6B5C", spineHeight: 285 },
  "The Staff Designer": { coverColor: "#342C64", spineHeight: 295 },
  "UX Strategy": { coverColor: "#FFFFFF", spineHeight: 308 },
  "The Laws of Simplicity": {
    coverColor: "#FFFFFF",
    spineHeight: 330,
    spineWidth: 62,
  },
};

export const DEFAULT_COVER_COLOR = "#A89880";
