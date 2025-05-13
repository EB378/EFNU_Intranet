"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Tooltip
} from "@mui/material";
import Link from "next/link";
import {
  Edit,
  Add,
  Event,
  Article,
  AccessTime,
} from "@mui/icons-material";
import { useTheme } from "@hooks/useTheme";
import { useGetIdentity } from "@refinedev/core";
import { ProfileName, ProfileAvatar } from "@components/functions/FetchFunctions";

export default function HomePage() {
  const theme = useTheme();
  const { data: identityData } = useGetIdentity<{ id: string }>();
  
   
  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const utcString = currentTime.toUTCString();
  const formattedTime = utcString.split(' ')[4];
  const formattedDate = utcString.split(' ').slice(0, 3).join(' ');
  
  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)' 
        : 'linear-gradient(45deg, #f5f7fa 30%, #e4e8f0 90%)',
      minHeight: '100vh'
    }}>
      {/* Main Grid Layout */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Time Card */}
          <Card sx={{ 
            borderRadius: '12px',
            boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
          }}>
            <CardContent>
              <Box sx={{ 
                display: "flex",
                flexDirection: { xs: "coloumn", md: "row" },
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500
                }}>
                  <AccessTime sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'white' : 'primary.dark' }} />
                  UTC Time
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                py: 2
              }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 300,
                  letterSpacing: 1,
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                }}>
                  {formattedTime}
                </Typography>
                <Typography variant="subtitle1" sx={{ 
                  mt: 1,
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                }}>
                  {formattedDate}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Profile Coloumn */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Profile Card */}
            <Card sx={{
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ProfileAvatar 
                    profileId={identityData?.id || ""} 
                  />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.contrastText }}>
                  Welcome back, <br/><ProfileName profileId={identityData?.id || ""} />
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                  {formattedDate}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: '12px',
            boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
          }}>
            <CardContent>
              <Box sx={{ 
                display: "flex",
                flexDirection: { xs: "coloumn", md: "row" },
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500
                }}>
                  <AccessTime sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'white' : 'primary.dark' }} />
                  Quick Actions
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Link href="/atis">
                  <Button variant="outlined" color="secondary">Report Trouble at EFNU</Button>
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}