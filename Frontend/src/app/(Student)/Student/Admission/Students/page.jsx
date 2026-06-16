"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentsCombined,
  fetchClasses,
  fetchSections,
  fetchSubjects,
  updateStudentInfo,
  deleteStudentInfo,
  createStudentSubject,
  deleteStudentSubject,
  fetchStudentSubjects,
} from "@/features/student/StudentThunk";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import DataTableToolbar from "@/components/table/DataTableToolbar";
import DataTablePagination from "@/components/table/DataTablePagination";

export default function StudentsPage() {
  const dispatch = useDispatch();
  const { data: students, count, totalPages, loading } = useSelector(
    (state) => state.student.studentList
  );
  const { data: classes } = useSelector((s) => s.student.classes);
  const { data: sections } = useSelector((s) => s.student.sections);
  const { data: allSubjects } = useSelector((s) => s.student.subjects);

  /* ──────────── Search / Filter / Ordering / Pagination ──── */
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(10);

  /* ──────────── Editing state ──────────── */
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  /* ──────────── Load libraries ──────────── */
  useEffect(() => {
    dispatch(fetchClasses({ records: 9999 }));
    dispatch(fetchSections());
    dispatch(fetchSubjects());
  }, [dispatch]);

  /* ──────────── Fetch ──────────── */
  const loadStudents = useCallback(() => {
    const params = { search, ordering, page, records };
    if (filterClass) params.school_class = filterClass;
    if (filterGender) params.gender = filterGender;
    if (filterStatus) params.status = filterStatus;
    dispatch(fetchStudentsCombined(params));
  }, [dispatch, search, filterClass, filterGender, filterStatus, ordering, page, records]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPage(1);
  }, [search, filterClass, filterGender, filterStatus, ordering, records]);
  /* eslint-enable react-hooks/set-state-in-effect */


  /* ──── Filter options ──── */
  const classFilterOptions = classes.map((cls) => ({
    value: String(cls.id),
    label: cls.name,
  }));



  /* ──────────── Edit handlers ──────────── */
  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      dob: s.dob,
      father: s.father,
      mother: s.mother,
      gender: s.gender,
      mobile: s.mobile,
      email: s.email || "",
      remarks: s.remarks || "",
      status: s.status,
      school_class: s.school_class ?? "",
      section: s.section ?? "",
      admission_id: s.admission_id,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      // Update student info
      await dispatch(
        updateStudentInfo({
          id,
          name: editForm.name,
          dob: editForm.dob,
          father: editForm.father,
          mother: editForm.mother,
          gender: editForm.gender,
          mobile: editForm.mobile,
          email: editForm.email || null,
          remarks: editForm.remarks || null,
          status: editForm.status,
        })
      ).unwrap();

      setEditingId(null);
      setEditForm({});
      loadStudents();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  /* ──────────── Delete ──────────── */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await dispatch(deleteStudentInfo(id)).unwrap();
      loadStudents();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ──────────── Input/Select class ──────────── */
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";
  const selectClass =
    "px-3 py-2 rounded-lg border border-border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Admitted Students
        </h1>
        <p className="mt-1 text-muted-foreground">
          Search, filter, sort, edit, or delete admitted students.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* ─── Toolbar ─── */}
        <DataTableToolbar
          search={search}
          setSearch={setSearch}
          filters={[

            {
              key: "school_class",
              label: "All Classes",
              options: classFilterOptions,
              value: filterClass,
              setValue: setFilterClass,
            },
            {
              key: "gender",
              label: "All Genders",
              options: [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ],
              value: filterGender,
              setValue: setFilterGender,
            },

            {
              key: "status",
              label: "All Statuses",
              options: [
                { value: "A", label: "Active" },
                { value: "I", label: "Inactive" },
              ],
              value: filterStatus,
              setValue: setFilterStatus,
            },
          ]}
          ordering={ordering}
          setOrdering={setOrdering}
          searchPlaceholder="Search students..."
          count={count}
          countLabel="Students"
        />



        {/* ─── Table ─── */}
        {loading ? (
          <div className="p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-medium text-foreground">No Students Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {search || filterName
                ? "Try adjusting your search or filters."
                : "No students have been admitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Father</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Mother</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Gender</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Mobile</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Class</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Section</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const isEditing = editingId === s.id;
                  return (
                    <tr key={s.id} className="border-t border-border hover:bg-accent/50 transition">
                      {isEditing ? (
                        <>
                          <td className="px-3 py-2 text-muted-foreground text-sm">#{s.id}</td>
                          <td className="px-3 py-2">
                            <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className={inputClass} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="father" value={editForm.father} onChange={handleEditChange} className={inputClass} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="mother" value={editForm.mother} onChange={handleEditChange} className={inputClass} />
                          </td>
                          <td className="px-3 py-2">
                            <select name="gender" value={editForm.gender} onChange={handleEditChange} className={selectClass}>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="mobile" value={editForm.mobile} onChange={handleEditChange} className={inputClass} />
                          </td>
                          <td className="px-3 py-2 text-muted-foreground text-sm">{s.class_name || "—"}</td>
                          <td className="px-3 py-2 text-muted-foreground text-sm">{s.section_name || "—"}</td>
                          <td className="px-3 py-2">
                            <select name="status" value={editForm.status} onChange={handleEditChange} className={selectClass}>
                              <option value="A">Active</option>
                              <option value="I">Inactive</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex justify-center gap-1">
                              <button onClick={() => saveEdit(s.id)} disabled={saving}
                                className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition" title="Save">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                              </button>
                              <button onClick={cancelEdit}
                                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition" title="Cancel">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-3 text-muted-foreground text-sm">
                            <Link
                              href={`/Student/Admission/Students/${s.id}`}
                              className="text-primary hover:text-primary/80 hover:underline font-mono font-semibold inline-flex items-center gap-1"
                            >
                              #{s.id}
                              <ExternalLink size={12} />
                            </Link>
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground text-sm">
                            <Link
                              href={`/Student/Admission/Students/${s.id}`}
                              className="text-foreground hover:text-primary hover:underline transition"
                            >
                              {s.name}
                            </Link>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground text-sm">{s.father}</td>
                          <td className="px-3 py-3 text-muted-foreground text-sm">{s.mother}</td>
                          <td className="px-3 py-3 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.gender === "Male" ? "bg-blue-500/10 text-blue-600"
                              : s.gender === "Female" ? "bg-pink-500/10 text-pink-600"
                                : "bg-gray-500/10 text-gray-600"
                              }`}>{s.gender}</span>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground text-sm">{s.mobile}</td>
                          <td className="px-3 py-3 text-muted-foreground text-sm">{s.class_name || "—"}</td>
                          <td className="px-3 py-3 text-muted-foreground text-sm">{s.section_name || "—"}</td>
                          <td className="px-3 py-3 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === "A" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                              }`}>{s.status === "A" ? "Active" : "Inactive"}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-center gap-1">
                              <button onClick={() => startEdit(s)}
                                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition" title="Edit">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDelete(s.id)}
                                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Pagination ─── */}
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          records={records}
          setRecords={setRecords}
          setPage={setPage}
          maxRecords={50}
        />
      </div>

    </div>
  );
}
