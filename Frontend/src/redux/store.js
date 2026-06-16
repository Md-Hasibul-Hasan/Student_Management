import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/count/countSlice";
import studentReducer from "@/features/student/studentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      student: studentReducer,
    },
  });
};
