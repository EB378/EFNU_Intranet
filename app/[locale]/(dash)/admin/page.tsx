// app/admin/page.tsx
'use client';

import { 
  Grid, Paper, Typography, Chip, Stack, LinearProgress, Box, 
  Button, keyframes, styled 
} from '@mui/material';
import {
  People, LocalGasStation, Assignment, Flight, 
  Article, Circle, Add, Notifications
} from '@mui/icons-material';
import PNStatusDashboard from '@/components/PNStatusDashboard';
import { useProfileStats } from '@/hooks/useProfileStats';
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  },
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme.palette.primary.main
  }
}));

const StatusIndicator = ({ label, status }: { label: string; status: string }) => {
  const getColor = () => {
    if (status === 'online') return '#4caf50';
    if (status === 'optimal') return '#4caf50';
    if (status === 'active') return '#2196f3';
    return '#9e9e9e';
  };

  return (
    <Box display="flex" alignItems="center" gap={2} p={1.5} bgcolor="action.hover" borderRadius={2}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: getColor(),
          animation: `${pulse} 2s infinite`,
          boxShadow: `0 0 8px ${getColor()}`
        }}
      />
      <Box>
        <Typography variant="body2" fontWeight="500">{label}</Typography>
        <Typography variant="caption" color="text.secondary" textTransform="capitalize">
          {status}
        </Typography>
      </Box>
    </Box>
  );
};

export default function AdminDashboard() {
  const { totalCount, todayCount } = useProfileStats();



  const metrics = {
    totalUsers: totalCount,
    pendingApprovals: 12,
    fuelLevel: 65,
    activeFlights: 18,
    recentPosts: 3,
    systemHealth: 'optimal'
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="800" color="primary.main">
          Airport Admin Overview
        </Typography>
        <Chip 
          label="Administrator View" 
          color="primary"
          variant="outlined"
          icon={<Circle sx={{ fontSize: 12 }} />}
          sx={{ borderRadius: 2, py: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Quick Status Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box p={3}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <People sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="600">Users</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" color="primary.main">
                  {metrics.totalUsers}
                </Typography>
                <Chip 
                  label={`+ ${todayCount} new today` }
                  color="success"
                  size="small"
                  sx={{ alignSelf: 'flex-start', borderRadius: 1 }}
                />
              </Stack>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box p={3}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Assignment sx={{ fontSize: 32, color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight="600">PN Approvals</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" color="warning.main">
                  {metrics.pendingApprovals}
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Notifications />}
                  sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                >
                  View Requests
                </Button>
              </Stack>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box p={3}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocalGasStation sx={{ fontSize: 32, color: 'success.main' }} />
                  <Typography variant="h6" fontWeight="600">Fuel Status</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.fuelLevel} 
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    background: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: 'linear-gradient(90deg, #4caf50, #8bc34a)'
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {metrics.fuelLevel}% Capacity Remaining
                </Typography>
              </Stack>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box p={3}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Flight sx={{ fontSize: 32, color: 'info.main' }} />
                  <Typography variant="h6" fontWeight="600">Flights</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" color="info.main">
                  {metrics.activeFlights}
                </Typography>
                <Chip 
                  label="2 delayed flights" 
                  color="error"
                  size="small"
                  sx={{ alignSelf: 'flex-start', borderRadius: 1 }}
                />
              </Stack>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <StyledPaper>
            <Box p={3}>
              <Typography variant="h6" fontWeight="700" mb={2}>Quick Actions</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #2196f3, #1976d2)'
                  }}
                >
                  Add User
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Article />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)'
                  }}
                >
                  New Post
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Flight />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #ff9800, #f57c00)'
                  }}
                >
                  Flight Alerts
                </Button>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <PNStatusDashboard/>
          </StyledPaper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box p={3}>
              <Typography variant="h6" fontWeight="700" mb={2}>System Status</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatusIndicator label="API Connectivity" status="online" />
                </Grid>
                <Grid item xs={6}>
                  <StatusIndicator label="Database" status="optimal" />
                </Grid>
                <Grid item xs={6}>
                  <StatusIndicator label="Cloud Storage" status="75%" />
                </Grid>
                <Grid item xs={6}>
                  <StatusIndicator label="Security" status="active" />
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}