"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  fetchClasses,
} from "@/features/student/StudentThunk";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import DataTableToolbar from "@/components/table/DataTableToolbar";
import DataTablePagination from "@/components/table/DataTablePagination";

export default function Page() {
  const dispatch = useDispatch();
  const { data: subjects, count, totalPages, loading } = useSelector(
    (state) => state.student.subjects
  );
  const { data: classes } = useSelector((s) => s.student.classes);

  /* CRUD form */
  const [subjectName, setSubjectName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ──────────────── Search / Filter / Ordering / Pagination ──── */
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(5);

  /* ──── Dropdown filters ──── */
  const [filterClass, setFilterClass] = useState("");

  /* ──────────────── Load classes ────────────── */
  useEffect(() => {
    dispatch(fetchClasses({ records: 9999 }));
  }, [dispatch]);

  /* ──────────────── Fetch via Redux ────────────── */
  const loadSubjects = useCallback(() => {
    const params = { search, ordering, page, records };
    if (filterClass) params.school_class = filterClass;
    dispatch(fetchSubjects(params));
  }, [dispatch, search, filterClass, ordering, page, records]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  /* Reset to page 1 when any filter/search/ordering changes */
  useEffect(() => {
    setPage(1);
  }, [search, filterClass, ordering, records]);

  /* ──────────────── CRUD ────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await dispatch(updateSubject({
          id: editingId,
          name: subjectName,
          school_class: selectedClass ? Number(selectedClass) : null,
        })).unwrap();
      } else {
        await dispatch(createSubject({
          name: subjectName,
          school_class: selectedClass ? Number(selectedClass) : null,
        })).unwrap();
      }
      setSubjectName("");
      setSelectedClass("");
      setEditingId(null);
      loadSubjects();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setSubjectName(item.name);
    setSelectedClass(item.school_class?.toString() || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await dispatch(deleteSubject(id)).unwrap();
      loadSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setSubjectName("");
    setSelectedClass("");
  };

  /* ──── Filter options ──── */
  const classFilterOptions = classes.map((cls) => ({
    value: String(cls.id),
    label: cls.name,
  }));

  const filters = [
    {
      key: "school_class",
      label: "All Classes",
      options: classFilterOptions,
      value: filterClass,
      setValue: setFilterClass,
    },
  ];

  /* ──────────────── Reusable input classes ───────── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";

  /* ──────────────── Render ─────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Subject Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create, update and manage subjects. Each subject must belong to a class.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─────── LEFT FORM ─────── */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? "Update Subject" : "Add Subject"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {editingId ? "Modify selected subject." : "Create a new subject for a class."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Subject" : "Add Subject"}
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
              filters={filters}
              ordering={ordering}
              setOrdering={setOrdering}
              searchPlaceholder="Search subjects..."
              count={count}
              countLabel="Subjects"
            />

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Subject List
              </h2>
            </div>

            {/* ── Table body ── */}
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading subjects...
              </div>
            ) : subjects.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="font-medium text-foreground">
                  No Subjects Found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {search || filterClass
                    ? "Try adjusting your search or filters."
                    : "Create your first subject from the left panel."}
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
                        Subject Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        Class
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((item) => (
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
                        <td className="px-6 py-4 text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {item.class_name || "—"}
                          </span>
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