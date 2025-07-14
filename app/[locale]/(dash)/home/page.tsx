"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { useTheme } from "@hooks/useTheme";
import { useTranslations } from "next-intl";
import { useList } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import { Blog } from "@types";
import {
  getfinishDate,
  getfinishTime,
  getlocalDate,
  getlocalTime,
  getutcDate,
  getutcTime
} from "@components/home/time";
import SunriseSunsetCard from "@components/home/SunriseSunsetCard"
import QuickAccessButtons from "@components/QuickAccessButtons";
import AlertCreateModal from "@components/home/CreateAlertPublicModal";

type QuickButton = {
  icon: React.ReactElement;
  label: string;
  path: string;
  name: string;
};


interface LocalBlog extends Blog {
  category: string;
  categoryColor?: string;
  excerpt: string;
  date: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  is_all_day: boolean;
  description?: string;
  location?: string;
  event_type: string;
  status: string;
  timezone: string;
  organizer_id: string;
}

export default function HomePage() {
  const t = useTranslations("Home");
  const t2 = useTranslations("NavBar");
  const theme = useTheme();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const buttons = QuickAccessButtons()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: eventData } = useList<CalendarEvent>({
    resource: "events",
    meta: { select: "*" },
    pagination: { pageSize: 10 },
    sorters: [{ field: "end_time", order: "asc" }],
    filters: [{ field: "end_time", operator: "gte", value: new Date().toISOString() }]
  });
  const events = eventData?.data || [];

  const { data: postData } = useList<LocalBlog>({
    resource: "blogs",
    meta: { select: "*" },
    pagination: { pageSize: 3 },
    sorters: [{ field: "published_at", order: "desc" }],
    filters: [{ field: "published", operator: "eq", value: true }]
  });
  const posts = postData?.data || [];

  const handleEventClick = (eventId: string) => {
    router.push(`/calendar/${eventId}`);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/blog/${postId}`);
  };

  const localTime = getlocalTime(currentTime);
  const utcTime = getutcTime(currentTime);
  const finishTime = getfinishTime(currentTime);
  const todayDate = getlocalDate(currentTime);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: theme.palette.mode === "dark"
          ? "radial-gradient(circle at top left, #111 0%, #1c1c1c 100%)"
          : "radial-gradient(circle at top left, #f0f4f8 0%, #e3e9f0 100%)",
        minHeight: "100vh"
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>{todayDate}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t("title")}</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Typography variant="body2">LCL: {localTime}</Typography>
          <Typography variant="body2">UTC: {utcTime}</Typography>
          <Typography variant="body2">FIN: {finishTime}</Typography>
        </Stack>
        <SunriseSunsetCard />
      </Box>

      <Box sx={{ mb: 5 }}>
        <Grid container spacing={2}>
          {buttons.map(({ icon, label, path }: QuickButton) => (
            <Grid item xs={6} sm={4} key={label}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  py: 4,
                  fontSize: "1.1rem",
                  borderRadius: "14px",
                  background: theme.palette.mode === "dark" ? "#263238" : "#1976d2",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  textTransform: "none",
                  '&:hover': {
                    background: theme.palette.mode === "dark" ? "#37474f" : "#1565c0"
                  }
                }}
                onClick={() => router.push(path)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.2
                  }}
                >
                  {icon}
                  {t2(`${label}`)}
                </Box>
              </Button>
            </Grid>
          ))}
        
          <Grid item xs={12}>
            <Button variant="outlined" color="secondary" sx={{ width: "100%" }} onClick={() => setCreateModalOpen(true)}>{t("ReportTroubleatEFNU")}</Button>
          </Grid>
        </Grid>
        <AlertCreateModal 
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
          }}
        />
        
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{t("AirportUpdates")}</Typography>
        <Stack spacing={2}>
          {posts.map(post => (
            <Card key={post.id} sx={{ p: 2, borderLeft: `4px solid ${post.categoryColor || theme.palette.primary.main}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{post.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>{post.content.substring(0, 80)}...</Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={() => handlePostClick(post.id)}>{t("readMore")}</Button>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{t("UpcomingEvents")}</Typography>
        <Stack spacing={2}>
          {events.map(event => (
            <Card key={event.id} sx={{ p: 2, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{event.title}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {format(event.start_time, "dd/MM/yyyy, HH:mm")} – {format(event.end_time, "HH:mm")}
              </Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={() => handleEventClick(event.id)}>{t("Details")}</Button>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}