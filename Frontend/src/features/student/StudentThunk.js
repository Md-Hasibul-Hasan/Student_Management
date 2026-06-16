import { createAsyncThunk } from "@reduxjs/toolkit";

const url = process.env.NEXT_PUBLIC_API_URL;

/* ──────────────── Classes ──────────────── */

const buildParams = (queryParams = {}) => {
  const params = new URLSearchParams();
  // Generic filter fields: pass any key-value pair as a query param
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params;
};

export const fetchClasses = createAsyncThunk(
  "student/fetchClasses",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = buildParams(queryParams);
      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/classes/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createClass = createAsyncThunk(
  "student/createClass",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/classes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClass = createAsyncThunk(
  "student/updateClass",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/classes/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  "student/deleteClass",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${url}/api/students/classes/${id}/`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Sections ──────────────── */

export const fetchSections = createAsyncThunk(
  "student/fetchSections",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = buildParams(queryParams);
      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/sections/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSection = createAsyncThunk(
  "student/createSection",
  async ({ name, school_class }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/sections/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, school_class }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  "student/updateSection",
  async ({ id, name, school_class }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/sections/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, school_class }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSection = createAsyncThunk(
  "student/deleteSection",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${url}/api/students/sections/${id}/`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Subjects ──────────────── */

export const fetchSubjects = createAsyncThunk(
  "student/fetchSubjects",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = buildParams(queryParams);
      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/subjects/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubject = createAsyncThunk(
  "student/createSubject",
  async ({ name, school_class }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/subjects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, school_class }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubject = createAsyncThunk(
  "student/updateSubject",
  async ({ id, name, school_class }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/subjects/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, school_class }),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  "student/deleteSubject",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${url}/api/students/subjects/${id}/`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Student Info ──────────────── */

export const createStudentInfo = createAsyncThunk(
  "student/createStudentInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/student-info/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStudentInfoList = createAsyncThunk(
  "student/fetchStudentInfoList",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = buildParams(queryParams);
      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/student-info/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStudentInfo = createAsyncThunk(
  "student/updateStudentInfo",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/student-info/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStudentInfo = createAsyncThunk(
  "student/deleteStudentInfo",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${url}/api/students/student-info/${id}/`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Student Detail (single student with combined data) ──────────────── */

export const fetchStudentDetail = createAsyncThunk(
  "student/fetchStudentDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/students-combined/${id}/`);
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Admission ──────────────── */

export const createAdmission = createAsyncThunk(
  "student/createAdmission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/admissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdmission = createAsyncThunk(
  "student/updateAdmission",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/admissions/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Students Combined (with admission & subjects) ──────────────── */

export const fetchStudentsCombined = createAsyncThunk(
  "student/fetchStudentsCombined",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = buildParams(queryParams);
      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/students-combined/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Student Subject ──────────────── */

export const createStudentSubject = createAsyncThunk(
  "student/createStudentSubject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/students/student-subjects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStudentSubjects = createAsyncThunk(
  "student/fetchStudentSubjects",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.student) params.set("student", String(queryParams.student));
      if (queryParams.school_class) params.set("school_class", String(queryParams.school_class));
      if (queryParams.records) params.set("records", String(queryParams.records));

      const queryString = params.toString();
      const response = await fetch(
        `${url}/api/students/student-subjects/${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStudentSubject = createAsyncThunk(
  "student/deleteStudentSubject",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${url}/api/students/student-subjects/${id}/`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ──────────────── Dashboard Stats ──────────────── */

export const fetchDashboardStats = createAsyncThunk(
  "student/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const endpoints = [
        `${url}/api/students/classes/?records=1`,
        `${url}/api/students/sections/?records=1`,
        `${url}/api/students/subjects/?records=1`,
        `${url}/api/students/student-info/?records=1`,
        `${url}/api/students/admissions/?records=1`,
      ];

      const responses = await Promise.all(
        endpoints.map((ep) => fetch(ep).then((r) => r.json()))
      );

      return {
        classCount: responses[0].count ?? 0,
        sectionCount: responses[1].count ?? 0,
        subjectCount: responses[2].count ?? 0,
        studentCount: responses[3].count ?? 0,
        admissionCount: responses[4].count ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);