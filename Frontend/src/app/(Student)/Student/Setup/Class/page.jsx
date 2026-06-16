"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "@/features/student/StudentThunk";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import DataTableToolbar from "@/components/table/DataTableToolbar";
import DataTablePagination from "@/components/table/DataTablePagination";

export default function Page() {
  const dispatch = useDispatch();
  const { data: classes, count, totalPages, loading } = useSelector(
    (state) => state.student.classes
  );

  /* CRUD form */
  const [className, setClassName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ──────────────── Search / Filter / Ordering / Pagination ──── */
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(5);

  /* ──────────────── Fetch via Redux ────────────── */
  const loadClasses = useCallback(() => {
    dispatch(
      fetchClasses({ search, name: filterName, ordering, page, records })
    );
  }, [dispatch, search, filterName, ordering, page, records]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  /* Reset to page 1 when any filter/search/ordering changes */
  useEffect(() => {
    setPage(1);
  }, [search, filterName, ordering, records]);

  /* ──────────────── CRUD ────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await dispatch(updateClass({ id: editingId, name: className })).unwrap();
      } else {
        await dispatch(createClass({ name: className })).unwrap();
      }
      setClassName("");
      setEditingId(null);
      loadClasses();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setClassName(item.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await dispatch(deleteClass(id)).unwrap();
      loadClasses();
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
                disabled={saving}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Class" : "Add Class"}
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
            <DataTableToolbar
              search={search}
              setSearch={setSearch}
              ordering={ordering}
              setOrdering={setOrdering}
              searchPlaceholder="Search classes..."
              count={count}
              countLabel="Classes"
            />

            {/* Table header (count) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Class List
              </h2>
              {/* <span className="text-sm text-muted-foreground">
                {count} Class{count !== 1 ? "es" : ""}
              </span> */}
            </div>

            {/* ── Table body ── */}
            {loading ? (
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
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              records={records}
              setRecords={setRecords}
              setPage={setPage}
              maxRecords={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}