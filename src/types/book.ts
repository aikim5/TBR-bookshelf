export type ReadingStatus = "to-read" | "reading" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string; // used for spine/cover color
  coverImage?: string; // optional image path
  genre: string;
  pages: number;
  status: ReadingStatus;
  rating?: number; // 1–5, only when finished
  summary: string; // short book summary (always visible)
  review?: string; // your personal review (only shown when finished)
  startedDate?: string; // ISO date string
  finishedDate?: string; // ISO date string
  spineHeight?: number; // override calculated spine height in px
  spineWidth?: number;  // override calculated spine width in px
}
