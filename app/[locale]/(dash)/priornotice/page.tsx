// src/pages/pn-form/list.tsx

"use client";

import { useTable, useGetIdentity } from "@refinedev/core";
import { 
  Grid, 
  Paper, 
  Typography, 
  Chip, 
  Stack, 
  Skeleton,
  Button,
  Box
} from "@mui/material";
import { Add as AddIcon, Flight } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "@mui/material/styles";
import { DeleteButton, EditButton } from "@refinedev/mui";
import { PriorNotice } from "@/types/index";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";

dayjs.extend(relativeTime);


const PNList = () => {
  const theme = useTheme();
  const route = useRouter();
  const t = useTranslations("PN");
  const { data: identityData } = useGetIdentity<{ id: string }>();

  const UserID = identityData?.id as string;
  
  // Fetch all public PN entries
  const { tableQueryResult: { data: publicData, isLoading: publicLoading } } = useTable({
    resource: "priornotice",
    sorters: {
      permanent: [
        { field: "dof", order: "asc" },
        { field: "dep_time", order: "asc" },
      ]
    },
    filters: {
      permanent: [
        { field: "dof", operator: "gte", value: dayjs().format("YYYY-MM-DD") }
      ]
    },
    pagination: {
      mode: "off",
    },
  });

  const publicPNs = (publicData?.data as PriorNotice[]) || [];
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Grid container spacing={3} >
      {/* Public Board Column */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, minHeight: '90vh', overflow: 'auto' }}>
          <Suspense fallback={<Spinner/>}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Flight sx={{ mr: 1, color: theme.palette.primary.main }} />
                {t("UpcomingFlights")}
              </Typography>
              <Button
                variant="contained"
                onClick={() => route.push("/priornotice/create")}
                sx={{ m: 2 }}
              >
                <AddIcon />
                {t("CreatePN")}
              </Button>
            </Box>
          </Suspense>
          {publicLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} sx={{ mb: 2 }} />
            ))
          ) : (
            publicPNs.map((pn: PriorNotice) => (
              <Paper key={pn.id} sx={{ p: 2, mb: 2, borderLeft: UserID === pn.uid ? `4px solid ${theme.palette.secondary.main}` : `4px solid ${theme.palette.primary.main}`, color: theme.palette.text.primary }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1">
                      {pn.aircraft.toUpperCase()} • {pn.pic_name.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(pn.dof).format('DD/MM/YYYY')} •   {pn.dep_time && pn.arr_time
                      ? `${pn.dep_time} - ${pn.arr_time}`
                      : pn.dep_time
                      ? `Dep: ${pn.dep_time}`
                      : pn.arr_time
                      ? `Arr: ${pn.arr_time}`
                      : 'Time not available'}
                    </Typography>
                    {UserID === pn.uid && isDateTimePassed(pn.dof, pn?.arr_time ?? pn?.dep_time ?? "") === false && (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}>
                        <EditButton
                          resource="priornotice"
                          hideText
                          recordItemId={pn.id}
                        />
                         <DeleteButton
                          resource="priornotice"
                          hideText
                          recordItemId={pn.id}
                        />
                      </Box>
                    )}

                  </div>
                  <Chip 
                    label={t(pn.status)} 
                    size="small" 
                    color={getStatusColor(pn.status)} 
                    
                  />
                </Stack>
              </Paper>
            ))
          )}
          
          {!publicLoading && publicPNs.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              {t("NoUpcomingFlightsScheduled")}
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PNList;



function isDateTimePassed(dateStr: string, timeStr: string): boolean {
  // Trim and validate input
  const cleanedTime = timeStr.trim();

  // If time is empty or just whitespace, treat it as missing
  if (!cleanedTime || cleanedTime.length === 0) return false;

  // Basic validation: must be 4 digits
  if (!/^\d{4}$/.test(cleanedTime)) {
    console.warn(`Skipping invalid time: "${timeStr}" for date: "${dateStr}"`);
    return false; // Invalid time format → do not consider it passed or valid
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.warn(`Skipping invalid date format: "${dateStr}"`);
    return false;
  }

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const hours = parseInt(cleanedTime.substring(0, 2), 10);
    const minutes = parseInt(cleanedTime.substring(2, 4), 10);

    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      isNaN(hours) || isNaN(minutes) ||
      hours < 0 || hours > 23 ||
      minutes < 0 || minutes > 59
    ) {
      console.warn(`Invalid datetime values in "${dateStr} ${cleanedTime}"`);
      return false;
    }

    const inputDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    return inputDateTime.getTime() < Date.now();
  } catch (error) {
    console.error("Error parsing date/time:", { dateStr, timeStr, error });
    return false;
  }
}
