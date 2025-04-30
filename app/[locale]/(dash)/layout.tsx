import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";
import React from "react";
import { CanAccess } from "@refinedev/core";
import { Header } from "@/components/header";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { CustomSider } from "@/components/CustomSider";
import { SessionSync } from "@components/SessionSync";


export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();



  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
      <ThemedLayoutV2 
        Header={Header}
        Sider={CustomSider}
      >
        <SessionSync />
            {/* <CanAccess> */}
                { children }
            {/* </CanAccess> */}
      </ThemedLayoutV2>
  );
}