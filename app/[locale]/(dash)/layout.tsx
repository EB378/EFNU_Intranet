

import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { Spinner } from "@components/ui/Spinner";
import { SessionSync } from "@components/Layout/SessionSync";
import Nav from "@components/navbar";
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
          <Suspense>
            <RightTabModal />
          </Suspense>
          <Suspense fallback={<Spinner/>}>
            { children }
          </Suspense>
        </Box>
        <Nav/>
      </>
  );
}