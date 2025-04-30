"use client";

import { useMemo } from "react";
import {
  useOne,
  HttpError,
} from "@refinedev/core";
import { ProfileData, ProfileSection } from "@/types/ProfileTypes";

export default function useAvailableSections(userId: string) {
  // Fetch the profile data
  const { data, isLoading, isError } = useOne<ProfileData, HttpError>({
    resource: "profiles",
    id: userId,
    meta: { select: "*" },
  });

  // Profile data
  const profile = data?.data;
  
  // Available sections
  const availableSections: ProfileSection[] = useMemo(() => {
    const defaultSections: ProfileSection[] = [
      { id: "all", name: "All Notes" },
      { id: "completed", name: "Completed" },
      { id: "archived", name: "Archived" },
    ];
    const customSections: ProfileSection[] = profile?.sections || [];
    const custom = customSections.filter(
      sec => !["completed", "all", "archived"].includes(sec.id)
    );
    return [...defaultSections, ...custom];
  }, [profile?.sections]);

  return {
    availableSections,
    isLoading,
    isError
  };
}