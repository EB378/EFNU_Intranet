// src/pages/pn-form/list.tsx

"use client";

import { useTable, useMany, useGetIdentity } from "@refinedev/core";
import { 
  Grid, 
  Paper, 
  Typography, 
  Chip, 
  Stack, 
  Skeleton,
  Divider,
  IconButton,
  Box
} from "@mui/material";
import { Edit, Delete, Flight } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "@mui/material/styles";
import { CreateButton } from "@refinedev/mui";

dayjs.extend(relativeTime);


interface PNEntry {
  id: string;
  aircraft_reg: string;
  pic_name: string;
  dep_time: string;
  arr_time: string;
  dep_date: string;
  from_location: string;
  to_location: string;
  status: string;
  created_at: string;
  // Add other fields as needed
}

const PNList = () => {
  const theme = useTheme();
  const { data: identity } = useGetIdentity<{ id: string }>();
  
  // Fetch all public PN entries
  const { tableQueryResult: { data: publicData, isLoading: publicLoading } } = useTable({
    resource: "pn_forms",
    filters: {
      permanent: [
        { field: "dep_date", operator: "gte", value: dayjs().format("YYYY-MM-DD") }
      ]
    }
  });

  const publicPNs = (publicData?.data as PNEntry[]) || [];
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Grid container spacing={3} >
      {/* Public Board Column */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, height: '80vh', overflow: 'auto' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Flight sx={{ mr: 1, color: theme.palette.primary.main }} />
              Upcoming Flights
            </Typography>
            <CreateButton 
              resource="priornotice"
            />
          </Box>
          
          {publicLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} sx={{ mb: 2 }} />
            ))
          ) : (
            publicPNs.map((pn: PNEntry) => (
              <Paper key={pn.id} sx={{ p: 2, mb: 2, borderLeft: `4px solid ${theme.palette.primary.main}`, color: theme.palette.text.primary }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1">
                      {pn.aircraft_reg} • {pn.pic_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(pn.dep_date).format('DD MMM')} • {pn.dep_time}-{pn.arr_time}
                    </Typography>
                    <Typography variant="caption">
                      {pn.from_location} → {pn.to_location}
                    </Typography>
                  </div>
                  <Chip 
                    label={pn.status} 
                    size="small" 
                    color={getStatusColor(pn.status)} 
                    
                  />
                </Stack>
              </Paper>
            ))
          )}
          
          {!publicLoading && publicPNs.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No upcoming flights scheduled
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PNList;