'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function NotamsPage() {
  const [notam, setNotam] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-notams');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotam(data.notams.trim());
    } catch (err) {
      console.error(err);
      setNotam('⚠️ Could not retrieve NOTAMs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotams();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        p: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 800, boxShadow: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              NOTAM
            </Typography>
            <IconButton onClick={fetchNotams} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Box>

          {loading ? (
            <>
              <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="95%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} />
            </>
          ) : notam ? (
            <Box
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              {notam}
            </Box>
          ) : (
            <Typography color="text.secondary">
              No NOTAM data available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
