"use client";

import { Box, Grid, Typography, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";

const WebCamPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const webcams = [
    {
      url: "https://atis.efnu.fi/webcam/cam-efnu-wx1.jpg",
      label: "Runway 27",
      description: "View of main runway approach"
    },
    {
      url: "https://atis.efnu.fi/webcam/cam-efnu-wx2.jpg",
      label: "Runway Intersection",
      description: "Taxiway and runway intersection"
    },
    {
      url: "https://atis.efnu.fi/webcam/cam-efnu-wx3.jpg",
      label: "Glider Runway 22",
      description: "Glider operations area"
    }
  ];

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      maxWidth: "1800px",
      margin: "0 auto"
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontWeight: 600,
        mb: 4,
        color: "text.primary"
      }}>
        EFNU Webcams
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4, color: "text.secondary" }}>
        Live views from around the airfield. Images refresh every 60 seconds.
      </Typography>

      <Grid container spacing={4}>
        {webcams.map((webcam, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{
              borderRadius: 2,
              overflow: "hidden",
              transition: "transform 0.3s ease-in-out",
              '&:hover': {
                transform: "translateY(-4px)",
                boxShadow: 6
              }
            }}>
              <Box sx={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingTop: "56.25%", // 16:9 aspect ratio
                backgroundColor: "grey.200"
              }}>
                {loading ? (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    sx={{ position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <img
                    src={webcam.url}
                    alt={webcam.label}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {webcam.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {webcam.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ 
                  mt: 1,
                  color: "text.disabled",
                  fontStyle: "italic"
                }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WebCamPage;