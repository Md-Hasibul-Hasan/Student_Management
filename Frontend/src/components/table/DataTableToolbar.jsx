"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export default function DataTableToolbar({
  search,
  setSearch,
  filterValue,
  setFilterValue,
  ordering,
  setOrdering,
  searchPlaceholder = "Search...",
  filterPlaceholder = "Filter...",
  count = 0,
  countLabel = "Items",
  orderingOptions = [
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "name", label: "Name (A–Z)" },
    { value: "-name", label: "Name (Z–A)" },
  ],
}) {
  const selectClass =
    "px-3 py-2 rounded-lg border border-border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
        />
      </div>

      {/* Filter */}
      <div className="relative min-w-[140px]">
        <SlidersHorizontal
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder={filterPlaceholder}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
        />
      </div>

      {/* Ordering */}
      <select
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
        className={selectClass}
      >
        {orderingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Count */}
      <span className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
        {count} {countLabel}
      </span>
    </div>
  );
}