"use client";

import React from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { Error, Warning, Info, Schedule } from "@mui/icons-material";
import { useList } from "@refinedev/core";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";


const AlertModal: React.FC = () => {
  const theme = useTheme();
  const t = useTranslations("Alerts");

  const { data, isLoading, isError } = useList({
    resource: "alerts",
    filters: [{ field: "is_active", operator: "eq", value: "true" }],
    sorters: [{ field: "severity", order: "asc" }],
    pagination: { pageSize: 100 },
  });

  const alerts = data?.data || [];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <Error color="error" />;
      case "warning":
        return <Warning color="warning" />;
      case "ongoing":
        return <Schedule color="info" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "success";
    }
  };

  return (

      <Box
        sx={{
          width: "100%",
          maxWidth: "90vw",
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {t("ActiveAlerts")}
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t("Loading alerts")}...
            </Typography>
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {t("Failed to load alerts")}
          </Alert>
        ) : alerts.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1">
              {t("No active alerts at this time")}
            </Typography>
          </Box>
        ) : (
          <List sx={{ overflow: "auto", flex: 1 }}>
            {alerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getAlertIcon(alert.alert_type)}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.severity}
                        size="small"
                        color={getSeverityColor(alert.severity)}
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {alert.description}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                        {alert.end_time ? (
                          <>
                            <Box component="span" fontWeight={600}>
                              {t("Ends:")}
                            </Box>{" "}
                            {formatDistanceToNow(new Date(alert.end_time), {
                              addSuffix: true,
                            })}
                          </>
                        ) : (
                          <Box
                            component="span"
                            sx={{ color: theme.palette.info.main, fontWeight: 600 }}
                          >
                            {t("Ongoing")}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
  );
};

export default AlertModal;
