"use client";

import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authProviderClient } from "@/providers/auth-provider/auth-provider.client";

export const GoogleSignUpButton = () => {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;

    if (!credential) return;

    const { error } = await authProviderClient.signInWithGoogle?.({ credential });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
      return;
    }

    // Redirect after successful login
    router.push("/home");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error("Google Login Failed")}
        text="signup_with"
        width="100%"
      />
    </GoogleOAuthProvider>
  );
};
