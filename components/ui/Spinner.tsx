// components/ui/Spinner.tsx
import React from "react";

export const Spinner = () => (
  <div style={{ padding: "1rem", textAlign: "center" }}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 44 44"
      stroke="#4f46e5"
      fill="none"
    >
      <circle cx="22" cy="22" r="20" strokeWidth="4" strokeOpacity="0.5" />
      <path d="M42 22c0-11.046-8.954-20-20-20" strokeWidth="4" />
    </svg>
  </div>
);
