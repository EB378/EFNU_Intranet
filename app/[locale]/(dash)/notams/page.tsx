'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
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

  const parseNotam = (raw: string) => {
    const lines = raw.split('\n').filter(Boolean);

    const locationLine = lines.find((l) => l.startsWith('NOTAM FOR:')) || '';
    const location = locationLine.replace('NOTAM FOR:', '').trim();

    const contentLine = lines.find(
      (l) => !l.startsWith('NOTAM FOR:') && !l.startsWith('+') && !l.startsWith('FROM:')
    ) || '';

    const fromLine = lines.find((l) => l.startsWith('FROM:')) || '';

    const fromMatch = fromLine.match(/FROM:\s*(\d{2})([A-Z]{3})(\d{2})\s*(\d{4})\??/);
    const toMatch = fromLine.match(/TO:\s*(\d{2})([A-Z]{3})(\d{2})\s*(\d{4})/);
    const refMatch = fromLine.match(/\(([^)]+)\)/);

    return {
      location,
      content: contentLine.trim(),
      from: fromMatch
        ? `${fromMatch[1]} ${fromMatch[2]} 20${fromMatch[3]} ${fromMatch[4].slice(
            0,
            2
          )}:${fromMatch[4].slice(2)}`
        : null,
      to: toMatch
        ? `${toMatch[1]} ${toMatch[2]} 20${toMatch[3]} ${toMatch[4].slice(
            0,
            2
          )}:${toMatch[4].slice(2)}`
        : null,
      reference: refMatch ? refMatch[1] : null,
    };
  };

  const parsed = notam ? parseNotam(notam) : null;

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
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          position: 'relative',
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              NOTAM
            </Typography>
            <IconButton onClick={fetchNotams} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Box>

          {parsed ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                📍 <strong>{parsed.location}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                🛰️ {parsed.content}
              </Typography>
              {parsed.from && (
                <Typography variant="body2">
                  🕓 <strong>From:</strong> {parsed.from}
                </Typography>
              )}
              {parsed.to && (
                <Typography variant="body2">
                  🕔 <strong>To:</strong> {parsed.to}
                </Typography>
              )}
              {parsed.reference && (
                <Typography variant="body2">
                  📎 <strong>Ref:</strong> {parsed.reference}
                </Typography>
              )}
            </>
          ) : (
            <Typography color="text.secondary">No NOTAM data available.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
