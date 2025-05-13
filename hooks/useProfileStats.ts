// hooks/useProfileStats.ts
'use client';

import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function useProfileStats() {
  const startOfDay = dayjs().utc().startOf('day').format();
  const endOfDay = dayjs().utc().endOf('day').format();
  
  const { data: totalData } = useList({
    resource: "profiles",
    config: { pagination: { mode: "off" } },
    meta: { select: "count" },
  });

  const { data: todayData } = useList({
    resource: "profiles",
    filters: [
      {
        field: "created_at",
        operator: "gte",
        value: startOfDay,
      },
      {
        field: "created_at",
        operator: "lte",
        value: dayjs(endOfDay).endOf('day').toISOString(),
      }
    ],
  });

  return {
    totalCount: totalData?.total || 0,
    todayCount: todayData?.data?.length || 0,
  };
}