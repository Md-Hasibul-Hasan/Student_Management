import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  createStudentInfo,
  fetchStudentInfoList,
  updateStudentInfo,
  deleteStudentInfo,
  createAdmission,
  fetchStudentsCombined,
  fetchStudentDetail,
  updateAdmission,
  createStudentSubject,
  fetchStudentSubjects,
  deleteStudentSubject,
  fetchDashboardStats,
} from "./StudentThunk";

const getPageSize = (action, fallback = 2) => {
  const requestedSize = Number(action.meta?.arg?.records);
  return Number.isFinite(requestedSize) && requestedSize > 0
    ? requestedSize
    : fallback;
};

const initialState = {
  /* ──── Classes ──── */
  classes: {
    data: [],
    count: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  /* ──── Sections ──── */
  sections: {
    data: [],
    count: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  /* ──── Subjects ──── */
  subjects: {
    data: [],
    count: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  /* ──── Student ──── */
  student: {
    data: null,
    loading: false,
    error: null,
  },
  /* ──── Admission ──── */
  admission: {
    data: null,
    loading: false,
    error: null,
  },
  /* ──── Student Subjects (selected for a student) ──── */
  studentSubjects: {
    data: [],
    loading: false,
    error: null,
  },
  /* ──── Student Info List (for table view) ──── */
  studentList: {
    data: [],
    count: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  /* ──── Dashboard ──── */
  dashboard: {
    classCount: 0,
    sectionCount: 0,
    subjectCount: 0,
    studentCount: 0,
    admissionCount: 0,
    loading: false,
    error: null,
  },
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    resetStudentError: (state) => {
      state.classes.error = null;
      state.sections.error = null;
      state.subjects.error = null;
      state.student.error = null;
      state.admission.error = null;
      state.studentSubjects.error = null;
    },
    resetAdmissionFlow: (state) => {
      state.student.data = null;
      state.admission.data = null;
      state.studentSubjects.data = [];
      state.studentSubjects.error = null;
      state.student.error = null;
      state.admission.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ──────────────── Classes ──────────────── */
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.classes.loading = true;
        state.classes.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes.loading = false;
        const data = action.payload;
        const pageSize = getPageSize(action);
        state.classes.data = data.results ?? data;
        state.classes.count = data.count ?? 0;
        state.classes.totalPages = data.count
          ? Math.ceil(data.count / pageSize)
          : 1;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.classes.loading = false;
        state.classes.error = action.payload;
      })
      .addCase(createClass.pending, (state) => {
        state.classes.loading = true;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.classes.loading = false;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.classes.loading = false;
        state.classes.error = action.payload;
      })
      .addCase(updateClass.pending, (state) => {
        state.classes.loading = true;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.classes.loading = false;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.classes.loading = false;
        state.classes.error = action.payload;
      })
      .addCase(deleteClass.pending, (state) => {
        state.classes.loading = true;
      })
      .addCase(deleteClass.fulfilled, (state) => {
        state.classes.loading = false;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.classes.loading = false;
        state.classes.error = action.payload;
      });

    /* ──────────────── Sections ──────────────── */
    builder
      .addCase(fetchSections.pending, (state) => {
        state.sections.loading = true;
        state.sections.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections.loading = false;
        const data = action.payload;
        const pageSize = getPageSize(action);
        state.sections.data = data.results ?? data;
        state.sections.count = data.count ?? 0;
        state.sections.totalPages = data.count
          ? Math.ceil(data.count / pageSize)
          : 1;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.sections.loading = false;
        state.sections.error = action.payload;
      })
      .addCase(createSection.pending, (state) => {
        state.sections.loading = true;
      })
      .addCase(createSection.fulfilled, (state) => {
        state.sections.loading = false;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.sections.loading = false;
        state.sections.error = action.payload;
      })
      .addCase(updateSection.pending, (state) => {
        state.sections.loading = true;
      })
      .addCase(updateSection.fulfilled, (state) => {
        state.sections.loading = false;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.sections.loading = false;
        state.sections.error = action.payload;
      })
      .addCase(deleteSection.pending, (state) => {
        state.sections.loading = true;
      })
      .addCase(deleteSection.fulfilled, (state) => {
        state.sections.loading = false;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.sections.loading = false;
        state.sections.error = action.payload;
      });

    /* ──────────────── Subjects ──────────────── */
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.subjects.loading = true;
        state.subjects.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects.loading = false;
        const data = action.payload;
        const pageSize = getPageSize(action);
        state.subjects.data = data.results ?? data;
        state.subjects.count = data.count ?? 0;
        state.subjects.totalPages = data.count
          ? Math.ceil(data.count / pageSize)
          : 1;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.subjects.loading = false;
        state.subjects.error = action.payload;
      })
      .addCase(createSubject.pending, (state) => {
        state.subjects.loading = true;
      })
      .addCase(createSubject.fulfilled, (state) => {
        state.subjects.loading = false;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.subjects.loading = false;
        state.subjects.error = action.payload;
      })
      .addCase(updateSubject.pending, (state) => {
        state.subjects.loading = true;
      })
      .addCase(updateSubject.fulfilled, (state) => {
        state.subjects.loading = false;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.subjects.loading = false;
        state.subjects.error = action.payload;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.subjects.loading = true;
      })
      .addCase(deleteSubject.fulfilled, (state) => {
        state.subjects.loading = false;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.subjects.loading = false;
        state.subjects.error = action.payload;
      });

    /* ──────────────── Student Info ──────────────── */
    builder
      .addCase(createStudentInfo.pending, (state) => {
        state.student.loading = true;
        state.student.error = null;
      })
      .addCase(createStudentInfo.fulfilled, (state, action) => {
        state.student.loading = false;
        state.student.data = action.payload;
      })
      .addCase(createStudentInfo.rejected, (state, action) => {
        state.student.loading = false;
        state.student.error = action.payload;
      });

    /* ──────────────── Admission ──────────────── */
    builder
      .addCase(createAdmission.pending, (state) => {
        state.admission.loading = true;
        state.admission.error = null;
      })
      .addCase(createAdmission.fulfilled, (state, action) => {
        state.admission.loading = false;
        state.admission.data = action.payload;
      })
      .addCase(createAdmission.rejected, (state, action) => {
        state.admission.loading = false;
        state.admission.error = action.payload;
      });

    /* ──────────────── Student Subjects ──────────────── */
    builder
      .addCase(createStudentSubject.pending, (state) => {
        state.studentSubjects.loading = true;
      })
      .addCase(createStudentSubject.fulfilled, (state, action) => {
        state.studentSubjects.loading = false;
        if (action.payload.id) {
          state.studentSubjects.data = [...state.studentSubjects.data, action.payload];
        } else {
          // batch create might return array
          state.studentSubjects.data = [
            ...state.studentSubjects.data,
            ...(Array.isArray(action.payload) ? action.payload : [action.payload]),
          ];
        }
      })
      .addCase(createStudentSubject.rejected, (state, action) => {
        state.studentSubjects.loading = false;
        state.studentSubjects.error = action.payload;
      })
      .addCase(fetchStudentSubjects.pending, (state) => {
        state.studentSubjects.loading = true;
      })
      .addCase(fetchStudentSubjects.fulfilled, (state, action) => {
        state.studentSubjects.loading = false;
        state.studentSubjects.data = action.payload.results ?? action.payload;
      })
      .addCase(fetchStudentSubjects.rejected, (state, action) => {
        state.studentSubjects.loading = false;
        state.studentSubjects.error = action.payload;
      })
      .addCase(deleteStudentSubject.fulfilled, (state, action) => {
        state.studentSubjects.data = state.studentSubjects.data.filter(
          (item) => item.id !== action.payload
        );
      });

    /* ──────────────── Students Combined ──────────────── */
    builder
      .addCase(fetchStudentsCombined.pending, (state) => {
        state.studentList.loading = true;
        state.studentList.error = null;
      })
      .addCase(fetchStudentsCombined.fulfilled, (state, action) => {
        state.studentList.loading = false;
        const data = action.payload;
        const pageSize = getPageSize(action, 10);
        state.studentList.data = data.results ?? data;
        state.studentList.count = data.count ?? 0;
        state.studentList.totalPages = data.count
          ? Math.ceil(data.count / pageSize)
          : 1;
      })
      .addCase(fetchStudentsCombined.rejected, (state, action) => {
        state.studentList.loading = false;
        state.studentList.error = action.payload;
      })
      .addCase(deleteStudentInfo.fulfilled, (state, action) => {
        state.studentList.data = state.studentList.data.filter(
          (item) => item.id !== action.payload
        );
      });

    /* ──────────────── Student Detail ──────────────── */
    builder
      .addCase(fetchStudentDetail.pending, (state) => {
        state.student.loading = true;
        state.student.error = null;
        state.student.data = null;
      })
      .addCase(fetchStudentDetail.fulfilled, (state, action) => {
        state.student.loading = false;
        state.student.data = action.payload;
      })
      .addCase(fetchStudentDetail.rejected, (state, action) => {
        state.student.loading = false;
        state.student.error = action.payload;
      });

    /* ──────────────── Update Admission ──────────────── */
    builder
      .addCase(updateAdmission.pending, (state) => {
        state.admission.loading = true;
        state.admission.error = null;
      })
      .addCase(updateAdmission.fulfilled, (state, action) => {
        state.admission.loading = false;
        state.admission.data = action.payload;
      })
      .addCase(updateAdmission.rejected, (state, action) => {
        state.admission.loading = false;
        state.admission.error = action.payload;
      });

    /* ──────────────── Dashboard Stats ──────────────── */
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.classCount = action.payload.classCount;
        state.dashboard.sectionCount = action.payload.sectionCount;
        state.dashboard.subjectCount = action.payload.subjectCount;
        state.dashboard.studentCount = action.payload.studentCount;
        state.dashboard.admissionCount = action.payload.admissionCount;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      });
  },
});

export const { resetStudentError, resetAdmissionFlow } = studentSlice.actions;
export default studentSlice.reducer;
