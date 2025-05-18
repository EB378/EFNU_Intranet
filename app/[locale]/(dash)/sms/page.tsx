"use client";

import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Chip, 
  Avatar, 
  Stack, 
  Pagination, 
  TextField,
  InputAdornment,
  Skeleton,
  Select,
  MenuItem
} from "@mui/material";
import { Search, Warning, CheckCircle, Assignment } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CreateButton } from "@refinedev/mui";

const ReportListPage = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    status: "all",
    category: "all"
  });

  // Mock data - replace with real API calls
  const mockReports = [
    {
      id: "SAFE-001",
      title: "Slippery Floor in Hangar B",
      category: "Housekeeping",
      status: "open",
      reportedBy: "John D.",
      date: "2025-05-05T17:11:38.947981+00:00",
      severity: "medium"
    },
    {
      id: "SAFE-002",
      title: "Missing Fire Extinguisher in Workshop",
      category: "Fire Safety",
      status: "in-progress",
      reportedBy: "Sarah M.",
      date: "2025-05-04T09:45:00+00:00",
      severity: "high"
    },
    {
      id: "SAFE-003",
      title: "Frayed Electrical Wiring Spotted",
      category: "Electrical",
      status: "resolved",
      reportedBy: "Mike R.",
      date: "2025-05-03T14:20:00+00:00",
      severity: "critical"
    },
  ];

  const [reports, setReports] = useState(mockReports);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const colorMap: Record<string, string> = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      critical: '#d32f2f'
    };
    
    return (
      <Avatar sx={{ 
        bgcolor: colorMap[severity] || '#9e9e9e',
        width: 32,
        height: 32
      }}>
        <Warning fontSize="small" />
      </Avatar>
    );
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      maxWidth: 1600,
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Assignment fontSize="large" />
          Safety Reports
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Active safety reports and incident tracking
        </Typography>
        <CreateButton/>
      </Box>

      {/* Filter Bar */}
      <Paper sx={{ 
        mb: 4,
        p: 2,
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <TextField
          placeholder="Search reports..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />

        <Select
          value={filter.status}
          onChange={(e) => setFilter({...filter, status: e.target.value})}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>

        <Select
          value={filter.category}
          onChange={(e) => setFilter({...filter, category: e.target.value})}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="Fire Safety">Fire Safety</MenuItem>
          <MenuItem value="Electrical">Electrical</MenuItem>
          <MenuItem value="Housekeeping">Housekeeping</MenuItem>
        </Select>
      </Paper>

      {/* Report List */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))
        ) : (
          reports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report.id}>
              <NextLink href={`/safety-reports/${report.id}`} passHref>
                <Paper component="a" sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {getSeverityIcon(report.severity)}
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {report.title}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Chip 
                          label={report.status.replace('-', ' ')}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {report.category}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Reported by {report.reportedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(report.date))} ago
                        </Typography>
                      </Stack>
                    </Box>

                    {report.status === 'resolved' && (
                      <CheckCircle color="success" />
                    )}
                  </Stack>
                </Paper>
              </NextLink>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={5} 
          color="primary" 
          shape="rounded"
          sx={{ '& .MuiPaginationItem-root': { borderRadius: 2 } }}
        />
      </Box>
    </Box>
  );
};

export default ReportListPage;