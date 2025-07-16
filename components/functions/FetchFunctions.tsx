"use client";

import React from "react";
import { useShow } from "@refinedev/core";
import { Avatar, Skeleton } from "@mui/material";

export function ProfileName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "fullname" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { fullname: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={100} />;
  if (!profileData) return null;

  return <span>{profileData.fullname}</span>;
}

export function ProfileAvatar({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "avatar_url" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { avatar_url: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton variant="circular" width={40} height={40} />;
  if (!profileData) return null;

  return <Avatar src={profileData.avatar_url} alt="pfp" />;
}

export function ProfileLicense({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "license" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { license: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={80} />;
  if (!profileData) return null;

  return <span>{profileData.license}</span>;
}

export function ProfilePhone({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "phone" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { phone: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={100} />;
  if (!profileData) return null;

  return <span>{profileData.phone}</span>;
}

export function ProfileEmail({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "email" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { email: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={150} />;
  if (!profileData) return null;

  return <span>{profileData.email}</span>;
}

export function ProfileRatings({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "ratings" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { ratings: string[] } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={100} />;
  if (!profileData) return null;

  return <span>{profileData.ratings?.join(", ")}</span>;
}

export function ProfileRole({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "role" },
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as { role: string[] | string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={80} />;
  if (!profileData) return null;

  const roleString = Array.isArray(profileData.role)
    ? profileData.role.join(", ")
    : profileData.role;

  return <span>{roleString ? roleString.charAt(0).toUpperCase() + roleString.slice(1) : ""}</span>;
}

export function FuelName({ id }: { id: string }) {
  const { queryResult } = useShow({
    resource: "fuels",
    id: id,
    meta: { select: "label" },
    queryOptions: { enabled: !!id },
  });

  const resourceData = queryResult?.data?.data as { label: string } | undefined;
  if (queryResult?.isLoading) return <Skeleton width={80} />;
  if (!resourceData) return null;

  return <span>{resourceData.label}</span>;
}


export function useProfilePNAircraft({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as {
    aircraft: string[];
  } | undefined;

  if (!queryResult?.isLoading && profileData?.aircraft) {
    return profileData.aircraft;
  }

  return [];
}

export function useAircraftMTOW({ aircraftId }: { aircraftId: string }) {
  const { queryResult } = useShow({
    resource: "aircraft",
    id: aircraftId,
    queryOptions: { enabled: !!aircraftId },
  });

  const mtow = queryResult?.data?.data?.mtow;

  return {
    mtow: typeof mtow === "number" ? mtow : undefined,
    isLoading: queryResult?.isLoading,
    error: queryResult?.error,
  };
}

export function useProfilePNPIC({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    queryOptions: { enabled: !!profileId },
  });

  const profileData = queryResult?.data?.data as {
    presaved?: {
      PIC?: string[];
    };
  } | undefined;

  if (!queryResult?.isLoading && profileData?.presaved?.PIC) {
    return profileData.presaved.PIC;
  }

  return [];
}
