"use client";

import Link from "next/link";
import { ReadingStatus } from "@/types/book";

interface StatusFilterProps {
  activeStatus: ReadingStatus | "all";
  counts: Record<ReadingStatus | "all", number>;
}

const FILTERS: { key: ReadingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "finished", label: "Finished" },
  { key: "reading", label: "Reading" },
  { key: "to-read", label: "To Read" },
];

export default function StatusFilter({ activeStatus, counts }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ key, label }) => (
        <Link
          key={key}
          href={key === "all" ? "/" : `/?status=${key}`}
          className={`px-4 py-1.5 rounded-sm text-xs font-light tracking-[0.12em] uppercase transition-colors ${
            activeStatus === key
              ? "bg-stone-700 text-stone-100"
              : "bg-transparent text-stone-500 border border-stone-300 hover:border-stone-500 hover:text-stone-700"
          }`}
        >
          {label}
          <span className="ml-1.5 text-xs opacity-70">{counts[key]}</span>
        </Link>
      ))}
    </div>
  );
}
