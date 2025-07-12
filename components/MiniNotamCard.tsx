'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@hooks/useTheme';

const MiniNotamCard = () => {
  const [notam, setNotam] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

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

  const parseNotam = (raw: string) => {
    const lines = raw.split('\n').filter(Boolean);

    const locationLine = lines.find((l) => l.startsWith('NOTAM FOR:')) || '';
    const location = locationLine.replace('NOTAM FOR:', '').trim();

    const contentLine = lines.find(
      (l) => !l.startsWith('NOTAM FOR:') && !l.startsWith('+') && !l.startsWith('FROM:')
    ) || '';

    return {
      location,
      content: contentLine.trim(),
    };
  };

  const parsed = notam ? parseNotam(notam) : null;

  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: theme.palette.strong.default }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight="bold" color="primary">
          NOTAM
        </Typography>
        <IconButton onClick={fetchNotams} disabled={loading} size="small">
          {loading ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small" />}
        </IconButton>
      </Box>

      {parsed ? (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            📍 {parsed.location}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            🛰️ {parsed.content}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No NOTAM data available.
        </Typography>
      )}
    </Paper>
  );
};

export default MiniNotamCard;
