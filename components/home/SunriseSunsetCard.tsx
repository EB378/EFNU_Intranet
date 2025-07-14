import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, useTheme, Stack } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import { format, parse } from 'date-fns';

type SunTimes = {
  sunrise: string;
  sunset: string;
  day_length: string;
  date: string;
  [key: string]: any;
};

const SunriseSunsetCard = () => {
  const theme = useTheme();
  const [times, setTimes] = useState<SunTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.sunrisesunset.io/json?lat=60.24859&lng=24.06534&date=today'
        );
        const data = await response.json();
        
        if (data.status === 'OK') {
          setTimes(data.results);
        } else {
          setError('Failed to fetch sun times');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    const parsedTime = parse(timeString, 'h:mm:ss a', new Date());
    return format(parsedTime, 'HH:mm');
  };

  return (
    
<>
    {loading ? (
        <Typography>Loading...</Typography>
    ) : error ? (
        <Typography color="error">{error}</Typography>
    ) : (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
          <Typography variant="caption">SR: {formatTime(times?.sunrise)}</Typography>
          <Typography variant="caption">SS: {formatTime(times?.sunset)}</Typography>
          <Typography variant="caption">Ops: 04:00–19:00 UTC</Typography>
      </Stack>
    )}
</>
  );
};

export default SunriseSunsetCard;