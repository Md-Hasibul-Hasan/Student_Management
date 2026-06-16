"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchStudentDetail,
  fetchClasses,
  fetchSections,
  fetchSubjects,
  updateStudentInfo,
  updateAdmission,
  createStudentSubject,
  deleteStudentSubject,
  fetchStudentSubjects,
  deleteStudentInfo,
} from "@/features/student/StudentThunk";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  Pencil,
  Plus,
  AlertTriangle,
} from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const student = useSelector((s) => s.student.student);
  const admission = useSelector((s) => s.student.admission);
  const { data: classes } = useSelector((s) => s.student.classes);
  const { data: sections } = useSelector((s) => s.student.sections);
  const { data: allSubjects } = useSelector((s) => s.student.subjects);
  const studentSubjects = useSelector((s) => s.student.studentSubjects);

  /* ──────────── Tabs ──────────── */
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "admission" | "subjects"

  /* ──────────── Personal Info Form ──────────── */
  const [personalForm, setPersonalForm] = useState({
    name: "",
    dob: "",
    father: "",
    mother: "",
    gender: "Male",
    mobile: "",
    email: "",
    remarks: "",
    status: "A",
  });
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalDirty, setPersonalDirty] = useState(false);

  /* ──────────── Admission Form ──────────── */
  const [admissionForm, setAdmissionForm] = useState({
    school_class: "",
    section: "",
    admission_date: "",
  });
  const [admissionSaving, setAdmissionSaving] = useState(false);
  const [admissionDirty, setAdmissionDirty] = useState(false);

  /* ──────────── Subject Selection ──────────── */
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectSaving, setSubjectSaving] = useState(false);

  /* ──────────── Delete state ──────────── */
  const [deleting, setDeleting] = useState(false);

  /* ──────────── Load data ──────────── */
  useEffect(() => {
    if (id) {
      dispatch(fetchStudentDetail(id));
      dispatch(fetchClasses({ records: 9999 }));
      dispatch(fetchSections({ records: 9999 }));
      dispatch(fetchSubjects({ records: 9999 }));
    }
  }, [dispatch, id]);

  /* ──────────── Load student subjects when admission class changes ──────────── */
  useEffect(() => {
    if (student.data?.id && admissionForm.school_class) {
      dispatch(
        fetchStudentSubjects({
          student: student.data.id,
          school_class: Number(admissionForm.school_class),
          records: 9999,
        })
      );
    }
  }, [dispatch, student.data?.id, admissionForm.school_class]);

  /* ──────────── Populate forms when student data loads ──────────── */
  useEffect(() => {
    if (student.data) {
      setPersonalForm({
        name: student.data.name || "",
        dob: student.data.dob || "",
        father: student.data.father || "",
        mother: student.data.mother || "",
        gender: student.data.gender || "Male",
        mobile: student.data.mobile || "",
        email: student.data.email || "",
        remarks: student.data.remarks || "",
        status: student.data.status || "A",
      });
      setAdmissionForm({
        school_class: student.data.school_class ?? "",
        section: student.data.section ?? "",
        admission_date: student.data.admission_date || "",
      });
    }
  }, [student.data]);

  /* ──────────── Populate selected subjects ──────────── */
  useEffect(() => {
    if (studentSubjects.data.length > 0) {
      setSelectedSubjects(studentSubjects.data.map((s) => s.subject));
    } else {
      setSelectedSubjects([]);
    }
  }, [studentSubjects.data]);

  /* ──────────── Personal form change ──────────── */
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
    setPersonalDirty(true);
  };

  /* ──────────── Save Personal Info ──────────── */
  const savePersonal = async () => {
    setPersonalSaving(true);
    try {
      await dispatch(
        updateStudentInfo({
          id,
          name: personalForm.name,
          dob: personalForm.dob,
          father: personalForm.father,
          mother: personalForm.mother,
          gender: personalForm.gender,
          mobile: personalForm.mobile,
          email: personalForm.email || null,
          remarks: personalForm.remarks || null,
          status: personalForm.status,
        })
      ).unwrap();

      setPersonalDirty(false);
      dispatch(fetchStudentDetail(id));
    } catch (error) {
      console.error("Failed to update student info:", error);
    } finally {
      setPersonalSaving(false);
    }
  };

  /* ──────────── Admission form change ──────────── */
  const handleAdmissionChange = (e) => {
    const { name, value } = e.target;
    setAdmissionForm((prev) => ({ ...prev, [name]: value }));
    setAdmissionDirty(true);
  };

  /* ──────────── Save Admission ──────────── */
  const saveAdmission = async () => {
    if (!student.data.admission_id) return;
    setAdmissionSaving(true);
    try {
      await dispatch(
        updateAdmission({
          id: student.data.admission_id,
          school_class: Number(admissionForm.school_class),
          section: Number(admissionForm.section),
          admission_date: admissionForm.admission_date,
        })
      ).unwrap();

      setAdmissionDirty(false);
      dispatch(fetchStudentDetail(id));
    } catch (error) {
      console.error("Failed to update admission:", error);
    } finally {
      setAdmissionSaving(false);
    }
  };

  /* ──────────── Subject toggle ──────────── */
  const handleSubjectToggle = (subjectId) => {
    const savedSubjectIds = studentSubjects.data.map((s) => s.subject);
    if (savedSubjectIds.includes(subjectId)) return;

    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((s) => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  /* ──────────── Save Subjects ──────────── */
  const saveSubjects = async () => {
    if (!student.data?.id || !admissionForm.school_class) return;
    setSubjectSaving(true);
    try {
      const existingIds = studentSubjects.data.map((s) => s.subject);
      const newSubjects = selectedSubjects.filter(
        (id) => !existingIds.includes(id)
      );

      for (const subjectId of newSubjects) {
        await dispatch(
          createStudentSubject({
            student: student.data.id,
            school_class: Number(admissionForm.school_class),
            subject: subjectId,
          })
        );
      }

      // Refresh
      await dispatch(
        fetchStudentSubjects({
          student: student.data.id,
          school_class: Number(admissionForm.school_class),
          records: 9999,
        })
      );
    } catch (error) {
      console.error("Failed to save subjects:", error);
    } finally {
      setSubjectSaving(false);
    }
  };

  /* ──────────── Remove a subject ──────────── */
  const handleRemoveSubject = async (ssId) => {
    try {
      await dispatch(deleteStudentSubject(ssId)).unwrap();
      await dispatch(
        fetchStudentSubjects({
          student: student.data.id,
          school_class: Number(admissionForm.school_class),
          records: 9999,
        })
      );
    } catch (error) {
      console.error("Failed to remove subject:", error);
    }
  };

  /* ──────────── Delete Student ──────────── */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await dispatch(deleteStudentInfo(id)).unwrap();
      router.push("/Student/Admission/Students");
    } catch (error) {
      console.error("Failed to delete student:", error);
      setDeleting(false);
    }
  };

  /* ──────────── Styles ──────────── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring transition";
  const labelClass = "block mb-2 text-sm font-medium text-foreground";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring transition";
  const tabClass = (active) =>
    `px-5 py-3 text-sm font-medium rounded-xl transition ${
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  /* ──────────── Loading ──────────── */
  if (student.loading && !student.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!student.data && !student.loading) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-6">The student you are looking for does not exist or has been removed.</p>
        <Link
          href="/Student/Admission/Students"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          <ChevronLeft size={16} />
          Back to Students
        </Link>
      </div>
    );
  }

  const data = student.data;
  const savedSubjectIds = studentSubjects.data.map((s) => s.subject);
  const isBusy = subjectSaving || studentSubjects.loading;

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-6">
        <Link
          href="/Student/Admission/Students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-3"
        >
          <ArrowLeft size={16} />
          Back to Students
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {data.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Student ID: #{data.id}
              {data.admission_id && (
                <span className="ml-3">Admission ID: #{data.admission_id}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition text-sm font-medium disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ─── Status Banner ─── */}
      <div className={`mb-6 p-4 rounded-xl border ${
        data.status === "A"
          ? "bg-green-500/5 border-green-500/20 text-green-600"
          : "bg-red-500/5 border-red-500/20 text-red-600"
      }`}>
        <div className="flex items-center gap-2">
          {data.status === "A" ? (
            <CheckCircle2 size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span className="font-medium">
            {data.status === "A" ? "Active" : "Inactive"} Student
          </span>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setActiveTab("personal")} className={tabClass(activeTab === "personal")}>
          <span className="flex items-center gap-2">
            <User size={16} />
            Personal Details
          </span>
        </button>
        <button onClick={() => setActiveTab("admission")} className={tabClass(activeTab === "admission")}>
          <span className="flex items-center gap-2">
            <GraduationCap size={16} />
            Admission Details
          </span>
        </button>
        <button onClick={() => setActiveTab("subjects")} className={tabClass(activeTab === "subjects")}>
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            Subjects ({studentSubjects.data.length})
          </span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: PERSONAL DETAILS                                          */}
      {/* ================================================================ */}
      {activeTab === "personal" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="text-primary" size={22} />
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
            </div>
            {personalDirty && (
              <button
                onClick={savePersonal}
                disabled={personalSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition text-sm disabled:opacity-50"
              >
                {personalSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" name="name" value={personalForm.name} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input type="date" name="dob" value={personalForm.dob} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Father's Name *</label>
              <input type="text" name="father" value={personalForm.father} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mother's Name *</label>
              <input type="text" name="mother" value={personalForm.mother} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select name="gender" value={personalForm.gender} onChange={handlePersonalChange} className={selectClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mobile *</label>
              <input type="text" name="mobile" value={personalForm.mobile} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={personalForm.email} onChange={handlePersonalChange} className={inputClass} placeholder="optional" />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={personalForm.status} onChange={handlePersonalChange} className={selectClass}>
                <option value="A">Active</option>
                <option value="I">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Remarks</label>
              <input type="text" name="remarks" value={personalForm.remarks} onChange={handlePersonalChange} className={inputClass} placeholder="optional" />
            </div>
          </div>

          {/* ─── Timestamps ─── */}
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>Created: {data.created_at ? new Date(data.created_at).toLocaleString() : "—"}</p>
            <p>Last Updated: {data.updated_at ? new Date(data.updated_at).toLocaleString() : "—"}</p>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: ADMISSION DETAILS                                         */}
      {/* ================================================================ */}
      {activeTab === "admission" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-primary" size={22} />
              <h2 className="text-xl font-semibold text-foreground">Admission Details</h2>
            </div>
            {admissionDirty && (
              <button
                onClick={saveAdmission}
                disabled={admissionSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition text-sm disabled:opacity-50"
              >
                {admissionSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Class *</label>
              <select name="school_class" value={admissionForm.school_class} onChange={handleAdmissionChange} className={selectClass}>
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Section *</label>
              <select name="section" value={admissionForm.section} onChange={handleAdmissionChange} className={selectClass}>
                <option value="">Select section</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Admission Date *</label>
              <input type="date" name="admission_date" value={admissionForm.admission_date} onChange={handleAdmissionChange} className={inputClass} />
            </div>
          </div>

          {/* ─── Admission info read-only ─── */}
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Admission Info</h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admission ID</span>
                <span className="font-medium text-foreground">#{data.admission_id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student ID</span>
                <span className="font-medium text-foreground">#{data.id}</span>
              </div>
              {data.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admitted On</span>
                  <span className="font-medium text-foreground">{new Date(data.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: SUBJECTS                                                  */}
      {/* ================================================================ */}
      {activeTab === "subjects" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary" size={22} />
              <h2 className="text-xl font-semibold text-foreground">Subject Selection</h2>
            </div>
            <button
              onClick={saveSubjects}
              disabled={isBusy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition text-sm disabled:opacity-50"
            >
              {isBusy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Subjects
                </>
              )}
            </button>
          </div>

          {!admissionForm.school_class ? (
            <div className="p-8 text-center text-muted-foreground">
              <AlertTriangle size={32} className="mx-auto mb-3 text-amber-500" />
              <p className="font-medium text-foreground mb-1">No Class Selected</p>
              <p className="text-sm">Please set the class in the Admission Details tab first.</p>
            </div>
          ) : (
            <>
              {/* Available subjects grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {allSubjects.map((sub) => {
                  const isSaved = savedSubjectIds.includes(sub.id);
                  const isSelected = selectedSubjects.includes(sub.id);

                  let cardStyle = "border-border bg-background text-muted-foreground hover:border-ring/50";
                  let checkStyle = "border-muted-foreground";

                  if (isSaved) {
                    cardStyle = "border-green-500/60 bg-green-50 dark:bg-green-950/20 text-muted-foreground cursor-not-allowed opacity-70";
                    checkStyle = "border-green-500 bg-green-500";
                  } else if (isSelected) {
                    cardStyle = "border-primary bg-primary/5 text-foreground";
                    checkStyle = "border-primary bg-primary";
                  }

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      disabled={isSaved || isBusy}
                      onClick={() => handleSubjectToggle(sub.id)}
                      className={`p-4 rounded-xl border-2 text-left transition ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${checkStyle}`}
                        >
                          {(isSaved || isSelected) && (
                            <CheckCircle2
                              size={14}
                              className={isSaved ? "text-green-500" : "text-primary-foreground"}
                            />
                          )}
                        </div>
                        <span className={`font-medium ${isSaved ? "text-muted-foreground line-through" : ""}`}>
                          {sub.name}
                          {isSaved && (
                            <span className="ml-1.5 text-[10px] text-green-600 dark:text-green-400 font-normal not-italic">
                              (saved)
                            </span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Saved subjects list */}
              {studentSubjects.data.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Saved Subjects ({studentSubjects.data.length})
                  </h4>
                  <div className="space-y-2">
                    {studentSubjects.data.map((ss) => {
                      const sub = allSubjects.find((s) => s.id === ss.subject);
                      return (
                        <div
                          key={ss.id}
                          className="flex items-center justify-between px-4 py-2 bg-background rounded-lg border border-border"
                        >
                          <span className="text-sm text-foreground">
                            {sub?.name ?? `Subject #${ss.subject}`}
                          </span>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleRemoveSubject(ss.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}