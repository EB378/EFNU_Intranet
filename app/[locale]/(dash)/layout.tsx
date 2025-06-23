

import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";
import React from "react";
import { CanAccess } from "@refinedev/core";
import { SessionSync } from "@components/Layout/SessionSync";
import MobileNav from "@components/navbar";
import { Box } from "@mui/material";
import RightTabModal from "@components/Layout/AlertTabComponent";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();



  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
      <>
        <SessionSync />
        <Box sx={{ mb: 10 }}>
          <RightTabModal />
          { children }
        </Box>
        <MobileNav></MobileNav>
      </>
  );
}