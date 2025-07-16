"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { authProviderClient } from "@/providers/auth-provider/auth-provider.client";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export const GoogleAuthButton = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;

          const { error } = await authProviderClient.signInWithGoogle?.({
            credential: credentialResponse.credential,
          });

          if (error) {
            console.error("Google Sign-in failed:", error);
          } else {
            window.location.href = "/home";
          }
        }}
        onError={() => {
          console.error("Google Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};
