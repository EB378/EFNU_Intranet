"use client";

import { useTable, useGetIdentity } from "@refinedev/core";
import {
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  Skeleton,
  Box
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "@mui/material/styles";
import { PriorNotice } from "@/types/index";
import { useTranslations } from "next-intl";
import MiniNotamCard from "@/components/MiniNotamCard";
import AlertModal from "@/components/AlertTabModal"; // Adjust path as needed
dayjs.extend(relativeTime);

const AirportBuletin = () => {
  const theme = useTheme();
  const t = useTranslations("PN");
  const { data: identityData } = useGetIdentity<{ id: string }>();

  const UserID = identityData?.id as string;

  const {
    tableQueryResult: { data: publicData, isLoading: publicLoading },
  } = useTable({
    resource: "priornotice",
    sorters: {
      permanent: [
        { field: "dof", order: "asc" },
        { field: "dep_time", order: "asc" },
      ],
    },
    filters: {
      permanent: [
        { field: "dof", operator: "gte", value: dayjs().format("YYYY-MM-DD") },
      ],
    },
    pagination: {
      mode: "off",
    },
  });

  const publicPNs = (publicData?.data as PriorNotice[]) || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid
      container
      spacing={2}
      direction="row"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Column 1: Prior Notices */}
      <Grid
        item
        xs={4}
        sx={{ overflowY: "auto", maxHeight: "100vh", p: 2 }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold">
          🛫 Prior Notices
        </Typography>

        {publicLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1 }} />
            ))
        ) : (
          publicPNs.map((pn: PriorNotice) => (
            <Paper
              key={pn.id}
              sx={{
                p: 1.5,
                mb: 1,
                fontSize: "0.9rem",
                borderLeft:
                  UserID === pn.uid
                    ? `4px solid ${theme.palette.secondary.main}`
                    : `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="body1" fontWeight="bold" noWrap>
                {pn.aircraft.toUpperCase()} • {pn.pic_name.toUpperCase()}
              </Typography>
              <Typography variant="caption">
                {dayjs(pn.dof).format("DD/MM/YYYY")} •{" "}
                {pn.dep_time || "--"} - {pn.arr_time || "--"}
              </Typography>
              <Chip
                label={t(pn.status)}
                size="small"
                color={getStatusColor(pn.status)}
                sx={{ mt: 0.5 }}
              />
            </Paper>
          ))
        )}

        {!publicLoading && publicPNs.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            {t("NoUpcomingFlightsScheduled")}
          </Typography>
        )}
      </Grid>

      {/* Column 2: NOTAM + Alerts */}
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "100vh",
          overflowY: "auto",
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📢 NOTMAS & Alerts
        </Typography>
        <MiniNotamCard />
        <Box flex={1}>
          <AlertModal />
        </Box>
      </Grid>

      {/* Column 3: Live EFNU Info */}
      <Grid item xs={4}>
        <iframe
          src="https://info.efnu.fi/"
          style={{
            width: "100%",
            height: "100vh",
            border: "none",
          }}
          title="EFNU Info"
        />
      </Grid>
    </Grid>
  );
};

export default AirportBuletin;
