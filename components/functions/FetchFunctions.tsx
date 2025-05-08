"use client";

import React from "react";
import { useList, useShow } from "@refinedev/core";
import { Typography, Avatar } from "@mui/material";

export function ProfileName({ profileId }: { profileId: string }) {
    const { queryResult } = useShow({
      resource: "profiles",
      id: profileId,
      meta: { select: "fullname" },
      queryOptions: { enabled: !!profileId },
    });
    const profileData = queryResult?.data?.data as { fullname: string} | undefined;
    if (!profileData) return <span>Loading...</span>;
    return <span>{profileData.fullname}</span>;
  }

export function ProfileAvatar({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
      resource: "profiles",
      id: profileId,
      meta: { select: "avatar_url" },
      queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { avatar_url: string;} | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <Avatar src={profileData.avatar_url} alt={"pfp"} />;
}

export function ProfileLicence({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
      resource: "profiles",
      id: profileId,
      meta: { select: "licence" },
      queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { licence: string;} | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <span>{profileData.licence}</span>;
}

export function ProfilePhone({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "phone_number" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { phone_number: string; } | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <span>{profileData.phone_number}</span>;
}

export function ProfileEmail({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "email" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { email: string; } | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <span>{profileData.email}</span>;
}

export function ProfileRatings({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "ratings" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { ratings: string[]; } | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <span>{profileData.ratings}</span>;
}
  
export function InstructorName({ instructorId }: { instructorId: string }) {
  const { queryResult } = useShow({
    resource: "instructors",
    id: instructorId,
    meta: { select: "profile_id" },
    queryOptions: { enabled: !!instructorId },
  });
  const data = queryResult?.data?.data as { profile_id: string } | undefined;
  if (!data) return <span>Loading...</span>;
  return <ProfileName profileId={data.profile_id} />;
}

export // Component to display a resource's name based on id.
function ResourceName({ id }: { id: string }) {
  const { queryResult } = useShow({
    resource: "resources",
    id: id,
    meta: { select: "name" },
    queryOptions: { enabled: !!id },
  });
  const resourceData = queryResult?.data?.data as { name: string } | undefined;
  if (!resourceData) return <span>Loading...</span>;
  return <span>{resourceData.name}</span>;
}