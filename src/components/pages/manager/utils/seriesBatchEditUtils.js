// seriesBatchEditUtils.js
// Utilities for Series model (Prisma)
// Fields:
//   id, cover_img_url, artist, title, type, medium, year, caption,
//   credits, special_thanks, introduction, order, mark, language, updatedAt

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeSeriesRow ─────────────────────────────────────────────
export function normalizeSeriesRow(raw = {}) {
  // Normalize introduction: ensure array
  let introduction = raw.introduction;
  if (Array.isArray(introduction)) {
    // keep as is
  } else if (typeof introduction === "string" && introduction.trim() !== "") {
    // If it's a string, split by common delimiters (; or ,) -> fallback to single item
    introduction = introduction.split(/[;,]\s*/).filter(Boolean);
  } else {
    introduction = [];
  }

  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    cover_img_url: raw.cover_img_url ?? "",
    artist:   raw.artist   ?? "",
    title:    raw.title    ?? "",
    type:     raw.type     ?? "",
    medium:   raw.medium   ?? "",
    year:     raw.year     ?? "",
    caption:  raw.caption  ?? "",
    credits:  raw.credits  ?? "",
    special_thanks: raw.special_thanks ?? "",

    introduction,

    order:    raw.order    ?? "",
  };
}

// ── getSeriesFieldGroups ──────────────────────────────────────────
export const getSeriesFieldGroups = (isCn) => {
  const groupKeyLabels = {
    basic:  isCn ? "基本信息" : "Basic Info",
    content: isCn ? "内容"   : "Content",
    credits: isCn ? "鸣谢"   : "Credits",
    introduction: isCn ? "引言" : "Introduction",
    meta:   isCn ? "元数据"   : "Metadata",
  };

  return {
    basic:    ["artist", "title", "type", "medium", "year"],
    content:  ["caption"],
    credits:  ["credits", "special_thanks"],
    introduction: ["introduction"],
    meta:     ["order"],
    groupKeyLabels,
  };
};

// ── getSeriesSchemaFields ─────────────────────────────────────────
export const getSeriesSchemaFields = () => [
  { name: "cover_img_url", labelKey: "coverImgUrl", label: "Cover Image URL" },
  { name: "artist",   labelKey: "artist",   label: "Artist"          },
  { name: "title",    labelKey: "title",    label: "Title"           },
  { name: "type",     labelKey: "type",     label: "Type"            },
  { name: "medium",   labelKey: "medium",   label: "Medium"          },
  { name: "year",     labelKey: "year",     label: "Year"            },
  { name: "caption",  labelKey: "caption",  label: "Caption"         },
  { name: "credits",  labelKey: "credits",  label: "Credits"         },
  { name: "special_thanks", labelKey: "specialThanks", label: "Special Thanks" },
  { name: "introduction", labelKey: "introduction", label: "Introduction" },
  { name: "order",    labelKey: "order",    label: "Order"           },
];

// ── getSeriesFieldTypes ───────────────────────────────────────────
export const getSeriesFieldTypes = () => ({
  arrayFields:     ["introduction"],
  multilineFields: ["caption", "credits", "special_thanks"], // optional; can adjust
});

// ── exportSeriesToCSV ──────────────────────────────────────────────
export const exportSeriesToCSV = (data, filename) => {
  const headers = [
    "cover_img_url",
    "artist",
    "title",
    "type",
    "medium",
    "year",
    "caption",
    "credits",
    "special_thanks",
    "introduction",
    "order",
  ];

  // Convert array field to semicolon‑separated string for CSV readability
  const arrayFields = ["introduction"];
  const exportData = data.map((item) => {
    const record = { ...item };
    for (const field of arrayFields) {
      if (Array.isArray(record[field])) {
        record[field] = record[field].join("; ");
      } else if (record[field] && typeof record[field] !== "string") {
        record[field] = String(record[field]);
      }
    }
    return record;
  });

  exportToCSV(exportData, headers, filename || `series_${new Date().toISOString().slice(0, 10)}.csv`);
};
