import { AuthPage } from "@/components/auth-page2";
import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";

export default async function ForgotPassword() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return <AuthPage type="forgotPassword" />;
}
