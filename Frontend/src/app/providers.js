"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  
  if (!storeRef.current) {
    // প্রথমবার রেন্ডার হওয়ার সময় স্টোর তৈরি করবে
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}