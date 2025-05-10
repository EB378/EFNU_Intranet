"use client";

import AdminNav from "@components/AdminNav";
import React, { use } from "react";
import { Box } from "@mui/material";

export default function Layout({ children }: React.PropsWithChildren) {

  return (
      <>
        <AdminNav />
        <Box sx={{ mb: 10 }}>
          { children }
        </Box>
      </>
  );
}