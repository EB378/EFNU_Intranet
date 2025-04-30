// CustomSider.tsx
"use client";

import React from "react";
import { ThemedSiderV2 } from "@refinedev/mui";
import { useGetIdentity } from "@refinedev/core";

export const CustomSider = () => {
  const { data: user } = useGetIdentity();

  return (
    <ThemedSiderV2
      render={({ items, logout }) => (
        <>
          {items}

          {/* Only show logout if user is logged in */}
          {user && logout}
        </>
      )}
    />
  );
};