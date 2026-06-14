"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  /* ──────────────── Data & UI state ──────────────── */
  const [classes, setClasses] = useState([]);
  const [count, setCount] = useState(0);

  /* CRUD form */
  const [className, setClassName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ──────────────── Search / Filter / Ordering / Pagination ──── */
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  /* ──────────────── Build query string ────────────── */
  const buildUrl = useCallback(
    (overridePage) => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filterName.trim()) params.set("name", filterName.trim());
      params.set("ordering", ordering);
      params.set("page", String(overridePage ?? page));
      params.set("records", String(records));
      return `${API}/api/students/classes/?${params.toString()}`;
    },
    [API, search, filterName, ordering, page, records],
  );

  /* ──────────────── Fetch classes ─────────────────── */
  const fetchClasses = useCallback(
    async (url) => {
      try {
        setFetching(true);
        const res = await fetch(url || buildUrl());
        const data = await res.json();

        // The DRF pagination returns { count, next, previous, results }
        setClasses(data.results ?? data);
        setCount(data.count ?? data.length ?? 0);
        setTotalPages(
          data.count
            ? Math.ceil(data.count / (Number(records) || 5))
            : 1,
        );
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    },
    [buildUrl, records],
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  /* Reset to page 1 when any filter/search/ordering changes */
  useEffect(() => {
    setPage(1);
  }, [search, filterName, ordering, records]);

  /* ──────────────── CRUD ────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    try {
      setLoading(true);

      if (editingId) {
        await fetch(`${API}/api/students/classes/${editingId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: className }),
        });
      } else {
        await fetch(`${API}/api/students/classes/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: className }),
        });
      }

      setClassName("");
      setEditingId(null);
      await fetchClasses();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setClassName(item.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/students/classes/${id}/`, { method: "DELETE" });
      await fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setClassName("");
  };

  /* ──────────────── Reusable input classes ───────── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";
  const selectClass =
    "px-3 py-2 rounded-lg border border-border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";

  /* ──────────────── Render ─────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Class Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create, update and manage classes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─────── LEFT FORM ─────── */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? "Update Class" : "Add Class"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {editingId ? "Modify selected class." : "Create a new class."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update Class" : "Add Class"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-3 rounded-xl border border-border text-muted-foreground hover:bg-accent transition"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ─────── RIGHT TABLE ─────── */}
        <div className="lg:col-span-8">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* ── Toolbar: search / filter / ordering ── */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search classes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
                />
              </div>

              {/* Filter by name */}
              <div className="relative min-w-[140px]">
                <SlidersHorizontal
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Filter name…"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
                />
              </div>

              {/* Ordering */}
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className={selectClass}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="name">Name (A–Z)</option>
                <option value="-name">Name (Z–A)</option>
              </select>
            </div>

            {/* Table header (count) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Class List
              </h2>
              <span className="text-sm text-muted-foreground">
                {count} Class{count !== 1 ? "es" : ""}
              </span>
            </div>

            {/* ── Table body ── */}
            {fetching ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading classes...
              </div>
            ) : classes.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="font-medium text-foreground">
                  No Classes Found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {search || filterName
                    ? "Try adjusting your search or filters."
                    : "Create your first class from the left panel."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        Class Name
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-border hover:bg-accent/50 transition"
                      >
                        <td className="px-6 py-4 text-muted-foreground">
                          #{item.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/80 text-sm font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages && (
              <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                {/* Records per page */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Per page
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={records}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= 10) setRecords(val);
                    }}
                    className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </button>

                  {/* Page jump input */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Go to</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={page}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1 && val <= totalPages) setPage(val);
                      }}
                      className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring"
                    />
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}