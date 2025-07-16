//providers/auth-provider/auth-provider.client.ts
"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

export const authProviderClient: AuthProvider & {
  signInWithGoogle?: (response: { credential: string }) => Promise<any>;
} = {
  login: async ({ email, password }) => {
    const supabase = await supabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error };
    }

    if (data?.session) {
      await supabase.auth.setSession(data.session);
      return { success: true, redirectTo: "/home" };
    }

    return {
      success: false,
      error: { name: "LoginError", message: "Invalid username or password" },
    };
  },

  logout: async () => {
    const supabase = await supabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error };
    }

    return { success: true, redirectTo: "/login" };
  },

  register: async ({ email, password, user_metadata = {} }) => {
    const supabase = await supabaseBrowserClient();
    const defaultMetadata = {
      fullname: "",
      license: "",
      role: "pilot",
      status: "active",
    };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { ...defaultMetadata, ...user_metadata },
        },
      });

      if (error) return { success: false, error };
      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return { success: false, error };
    }
  },

  check: async () => {
    const supabase = await supabaseBrowserClient();
    const { data, error } = await supabase.auth.getUser();
    const { user } = data;

    if (error || !user) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    return { authenticated: true };
  },

  getPermissions: async () => {
    const supabase = await supabaseBrowserClient();
    try {
      const { error } = await supabase.auth.getUser();
      if (error) return;
      const { data } = await supabase.rpc("get_my_claim", { claim: "role" });
      return data;
    } catch (error: any) {
      console.error(error);
      return;
    }
  },

  getIdentity: async () => {
    const supabase = await supabaseBrowserClient();
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },

  onError: async (error) => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return { logout: true };
    }

    return { error };
  },

  // ✅ Google ID Token Sign-in method
  signInWithGoogle: async ({ credential }) => {
    const supabase = await supabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: credential,
      nonce: "<NONCE>", // Replace this with your nonce if verifying
    });

    if (error) {
      console.error("Google sign-in failed:", error);
    }

    return { data, error };
  },
};
