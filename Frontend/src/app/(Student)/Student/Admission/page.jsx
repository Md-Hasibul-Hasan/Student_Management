"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  fetchSections,
  fetchSubjects,
  createStudentInfo,
  createAdmission,
  createStudentSubject,
  fetchStudentSubjects,
  deleteStudentSubject,
} from "@/features/student/StudentThunk";
import { resetAdmissionFlow } from "@/features/student/studentSlice";
import {
  CheckCircle2,
  UserPlus,
  BookOpen,
  Loader2,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function AdmissionPage() {
  const dispatch = useDispatch();

  /* ──────────── Redux state ──────────── */
  const { data: classes } = useSelector((s) => s.student.classes);
  const { data: sections } = useSelector((s) => s.student.sections);
  const { data: subjects } = useSelector((s) => s.student.subjects);
  const student = useSelector((s) => s.student.student);
  const admission = useSelector((s) => s.student.admission);
  const studentSubjects = useSelector((s) => s.student.studentSubjects);

  /* ──────────── Step state ──────────── */
  const [step, setStep] = useState(1); // 1 = admission form, 2 = subject selection

  /* ──────────── Form fields (Step 1) ──────────── */
  const [form, setForm] = useState({
    name: "",
    dob: "",
    father: "",
    mother: "",
    gender: "Male",
    mobile: "",
    email: "",
    remarks: "",
    school_class: "",
    section: "",
    admission_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────── Subject selection (Step 2) ──────────── */
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [saving, setSaving] = useState(false); // local flag: true during save+refetch cycle

  /* Derived: IDs of subjects already saved on the server for this student */
  const savedSubjectIds = studentSubjects.data.map((s) => s.subject);

  const handleSubjectToggle = (subjectId) => {
    // Lock: already-saved subjects cannot be toggled — must delete from Saved Subjects first
    if (savedSubjectIds.includes(subjectId)) return;

    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  /* ──────────── Filtered sections & subjects based on selected class ──────────── */
  const filteredSections = sections.filter(
    (sec) => !form.school_class || sec.school_class === Number(form.school_class)
  );
  const filteredSubjects = subjects.filter(
    (sub) => !form.school_class || sub.school_class === Number(form.school_class)
  );

  /* ──────────── Load initial data ──────────── */
  useEffect(() => {
    dispatch(fetchClasses({ records: 9999 }));
    dispatch(fetchSections({ records: 9999 }));
    dispatch(fetchSubjects({ records: 9999 }));
  }, [dispatch]);

  /* ──────────── Load saved subjects after admission ──────────── */
  useEffect(() => {
    if (admission.data?.id && student.data?.id) {
      dispatch(
        fetchStudentSubjects({
          student: student.data.id,
          school_class: form.school_class,
          records: 9999,
        })
      );
    }
  }, [admission.data?.id, student.data?.id, dispatch, form.school_class]);

  /* Initialize selectedSubjects from saved data when admission first loads */
  useEffect(() => {
    if (step === 2 && studentSubjects.data.length > 0 && selectedSubjects.length === 0) {
      setSelectedSubjects(studentSubjects.data.map((s) => s.subject));
    }
  }, [step, studentSubjects.data]);



  /* ──────────── Submit Step 1 ──────────── */
  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create Student Info
      const studentResult = await dispatch(
        createStudentInfo({
          name: form.name,
          dob: form.dob,
          father: form.father,
          mother: form.mother,
          gender: form.gender,
          mobile: form.mobile,
          email: form.email || null,
          remarks: form.remarks || null,
        })
      ).unwrap();

      if (!studentResult.id) return;

      // 2. Create Admission
      await dispatch(
        createAdmission({
          student: studentResult.id,
          admission_date: form.admission_date,
          school_class: Number(form.school_class),
          section: Number(form.section),
        })
      ).unwrap();

      // Move to step 2
      setStep(2);
    } catch (error) {
      console.error("Admission failed:", error);
    }
  };

  /* ──────────── Submit Step 2 ──────────── */
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubjects.length || !student.data?.id) return;

    setSaving(true);
    try {
      // Only get existing subjects for THIS student (backend now filters by student)
      const existingIds = studentSubjects.data.map((s) => s.subject);

      // Filter out subjects already saved for this student
      const newSubjects = selectedSubjects.filter(
        (id) => !existingIds.includes(id)
      );

      if (newSubjects.length === 0) {
        // All selected subjects are already saved — just refetch
        await dispatch(
          fetchStudentSubjects({
            student: student.data.id,
            school_class: form.school_class,
            records: 9999,
          })
        );
        setSaving(false);
        return;
      }

      // Create each new subject sequentially (not parallel) to avoid race conditions
      for (const subjectId of newSubjects) {
        const result = await dispatch(
          createStudentSubject({
            student: student.data.id,
            school_class: Number(form.school_class),
            subject: subjectId,
          })
        );

        if (result.meta.requestStatus === "rejected") {
          console.warn(`Subject ${subjectId} failed to save:`, result.payload);
        }
      }

      // Wait for refetch to complete before re-enabling the button
      await dispatch(
        fetchStudentSubjects({
          student: student.data.id,
          school_class: form.school_class,
          records: 9999,
        })
      );
    } catch (error) {
      console.error("Subject selection failed:", error);
    } finally {
      setSaving(false);
    }
  };

  /* ──────────── Remove a subject ──────────── */
  const handleRemoveSubject = async (id) => {
    try {
      await dispatch(deleteStudentSubject(id)).unwrap();
      // Remove the deleted subject from local selectedSubjects as well
      const deletedSubjectId = studentSubjects.data.find(
        (ss) => ss.id === id
      )?.subject;
      if (deletedSubjectId) {
        setSelectedSubjects((prev) =>
          prev.filter((subjectId) => subjectId !== deletedSubjectId)
        );
      }
    } catch (error) {
      console.error("Failed to remove subject:", error);
    }
  };

  /* ──────────── Reset / start fresh ──────────── */
  const handleReset = () => {
    dispatch(resetAdmissionFlow());
    setStep(1);
    setForm({
      name: "",
      dob: "",
      father: "",
      mother: "",
      gender: "Male",
      mobile: "",
      email: "",
      remarks: "",
      school_class: "",
      section: "",
      admission_date: "",
    });
    setSelectedSubjects([]);
    setSaving(false);
  };

  /* ──────────── Reusable input class ──────────── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring transition";
  const labelClass = "block mb-2 text-sm font-medium text-foreground";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-ring/20 focus:border-ring transition";

  /* ──────────── Step indicator ──────────── */
  const StepIndicator = () => (
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {student.data ? <CheckCircle2 size={18} /> : 1}
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          Student & Admission
        </span>
      </div>

      <div className="flex-1 h-px bg-border" />

      <div
        className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {studentSubjects.data.length > 0 ? (
            <CheckCircle2 size={18} />
          ) : (
            2
          )}
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          Subject Selection
        </span>
      </div>
    </div>
  );

  const isBusy = studentSubjects.loading || saving;

  /* ================================================================ */
  /* RENDER */
  /* ================================================================ */
  return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Student Admission
          </h1>
          <p className="mt-1 text-muted-foreground">
            Register a new student with class, section, and subject selection.
          </p>
        </div>

        {/* Step Progress */}
        <StepIndicator />

        {/* ========== STEP 1: Student + Admission Form ========== */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-primary" size={22} />
              <h2 className="text-xl font-semibold text-foreground">
                Student Information & Admission
              </h2>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              {/* ─── Student Info ─── */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 pb-2 border-b border-border">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Student name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Father's Name *</label>
                    <input
                      type="text"
                      name="father"
                      value={form.father}
                      onChange={handleChange}
                      required
                      placeholder="Father name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mother's Name *</label>
                    <input
                      type="text"
                      name="mother"
                      value={form.mother}
                      onChange={handleChange}
                      required
                      placeholder="Mother name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className={selectClass}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Mobile *</label>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      placeholder="Mobile number"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email (optional)"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Remarks</label>
                    <input
                      type="text"
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      placeholder="Remarks (optional)"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ─── Admission Info ─── */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 pb-2 border-b border-border">
                  Admission Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Class *</label>
                    <select
                      name="school_class"
                      value={form.school_class}
                      onChange={handleChange}
                      required
                      className={selectClass}
                    >
                      <option value="">Select class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Section *</label>
                    <select
                      name="section"
                      value={form.section}
                      onChange={handleChange}
                      required
                      className={selectClass}
                    >
                      <option value="">Select section</option>
                      {filteredSections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {sec.name}
                        </option>
                      ))}
                      {filteredSections.length === 0 && form.school_class && (
                        <option value="" disabled>No sections for this class</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Admission Date *</label>
                    <input
                      type="date"
                      name="admission_date"
                      value={form.admission_date}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ─── Submit ─── */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={student.loading || admission.loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {student.loading || admission.loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit & Next
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========== STEP 2: Subject Selection ========== */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Success summary */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-green-500" size={22} />
                <h2 className="text-xl font-semibold text-foreground">
                  Admission Completed
                </h2>
              </div>

              {student.data && (
                <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">Student:</span>{" "}
                    {student.data.name}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">ID:</span> #
                    {student.data.id}
                  </p>
                  {admission.data && (
                    <p>
                      <span className="font-medium text-foreground">
                        Admission ID:
                      </span>{" "}
                      #{admission.data.id}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Subject selection */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-primary" size={22} />
                <h2 className="text-xl font-semibold text-foreground">
                  Select Subjects
                </h2>
              </div>

              <form onSubmit={handleSubjectSubmit}>
                {studentSubjects.loading && !saving ? (
                  <div className="py-8 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Loading subjects...
                  </div>
                ) : (
                  <>
                    {/* Available subjects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {filteredSubjects.map((sub) => {
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
                                    className={
                                      isSaved
                                        ? "text-green-500"
                                        : "text-primary-foreground"
                                    }
                                  />
                                )}
                              </div>
                              <span className={`font-medium ${isSaved ? "text-muted-foreground " : ""}`}>
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

                    {/* Already saved subjects list */}
                    {studentSubjects.data.length > 0 && (
                      <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                        <h4 className="text-sm font-medium text-foreground mb-3">
                          Saved Subjects ({studentSubjects.data.length})
                        </h4>
                        <div className="space-y-2">
                          {studentSubjects.data.map((ss) => {
                            const sub = subjects.find(
                              (s) => s.id === ss.subject
                            );
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

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-accent transition text-sm disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                        New Admission
                      </button>

                      <button
                        type="submit"
                        disabled={isBusy || !selectedSubjects.length}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50 text-sm"
                      >
                        {isBusy ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Subjects"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }