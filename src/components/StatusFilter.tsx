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
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeStatus === key
              ? "bg-amber-800 text-white"
              : "bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:text-amber-800"
          }`}
        >
          {label}
          <span className="ml-1.5 text-xs opacity-70">{counts[key]}</span>
        </Link>
      ))}
    </div>
  );
}
