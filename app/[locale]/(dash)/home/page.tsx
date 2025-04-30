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

export default function home() {
  const theme = useTheme();
  const { data: identityData } = useGetIdentity<{ id: string }>();
  
  // State for editable note
  const [isEditingQuickNote, setIsEditingQuickNote] = useState(false);
 
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
      <Grid container spacing={3}>
        {/* Left Column - Profile and Verse */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Profile Card */}
            <Card sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                : 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
              color: 'white',
              borderRadius: 2,
              boxShadow: theme.shadows[6]
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ProfileAvatar 
                    profileId={identityData?.id || ""} 
                  />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Welcome back, <br/><ProfileName profileId={identityData?.id || ""} />
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                  {formattedDate}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<Event />}
                    sx={{
                      borderRadius: 20,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Events
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 20,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<Article />}
                  >
                    Posts
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        
        {/* Middle Column - Time and Quick Note */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Time Card */}
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)'
                : 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)'
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
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
          </Stack>
        </Grid>
        
        {/* Right Column - Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            height: '100%',
            background: theme.palette.background.paper
          }}>
            <CardHeader 
              title="Upcoming Events" 
              titleTypographyProps={{ 
                variant: 'h6',
                color: 'text.primary',
                fontWeight: 500 
              }}
              action={
                <Tooltip title="Add event">
                  <IconButton>
                    <Add />
                  </IconButton>
                </Tooltip>
              }
              sx={{ 
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1
              }}
            />
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100% - 60px)',
                textAlign: 'center'
              }}>
                <Event sx={{ 
                  fontSize: 60, 
                  color: theme.palette.text.disabled,
                  mb: 2
                }} />
                <Typography variant="body1" color="text.secondary">
                  No upcoming events scheduled
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    mt: 3,
                    borderRadius: 20,
                    px: 3,
                    textTransform: 'none'
                  }}
                  startIcon={<Add />}
                >
                  Create New Event
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}