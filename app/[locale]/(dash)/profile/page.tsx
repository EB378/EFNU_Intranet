"use client";

import React, { useState } from "react"
import { useGetIdentity, useNotification } from "@refinedev/core";
import { 
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  LinearProgress,
  Chip
} from "@mui/material";
import { 
  Person as UserIcon, 
  LocalGasStation as FuelIcon, 
  AttachMoney as DollarIcon, 
  Description as FileTextIcon 
} from "@mui/icons-material";
import { BarChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ProfileAvatar } from "@components/functions/FetchFunctions"

const Profile = () => {
  const { open } = useNotification();
  const { data: identityData } = useGetIdentity<{ id: string }>();
  
  const [fuelData] = useState([
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1100 },
    { month: 'May', amount: 1300 },
    { month: 'Jun', amount: 800 },
  ]);

  const [feeData] = useState([
    { id: 1, type: "Landing Fee", amount: "$250.00", status: "Paid", dueDate: "2025-04-15" },
    { id: 2, type: "Hangar Rental", amount: "$1,200.00", status: "Pending", dueDate: "2025-05-01" },
    { id: 3, type: "Aircraft Registration", amount: "$450.00", status: "Overdue", dueDate: "2025-04-01" },
    { id: 4, type: "Maintenance Fee", amount: "$350.00", status: "Paid", dueDate: "2025-03-20" },
  ]);

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Chip label={status} color="success" size="small" />;
      case "pending":
        return <Chip label={status} color="warning" size="small" />;
      case "overdue":
        return <Chip label={status} color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleDownloadStatement = () => {
    open?.({
      type: "success",
      message: "Statement Downloaded", // Changed from 'title' to 'message'
      description: "Your complete fee statement has been downloaded.",
    });
  };

  const uid = identityData?.id as string;

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Pilot Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Personal Information</Typography>
                    <ProfileAvatar profileId={uid}/>
                  </Box>
                }
                subheader="Your pilot details"
              />
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <ProfileAvatar profileId={uid}/>
                  <Box>
                    <Typography variant="h6">John Pilot</Typography>
                    <Typography variant="body2" color="text.secondary">License #: PI-23456-A</Typography>
                  </Box>
                </Box>
                <Box>
                  {[
                    { label: "Email", value: "john.pilot@airmail.com" },
                    { label: "Phone", value: "(555) 123-4567" },
                    { label: "Aircraft", value: "Cessna 172 (N12345)" },
                    { label: "Hangar", value: "B-42" },
                    { label: "Certification", value: "Commercial" }
                  ].map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        py: 1, 
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography color="text.secondary">{item.label}</Typography>
                      <Typography fontWeight="medium">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="outlined" size="small">
                  Edit Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Fee Status Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Fee Status</Typography>
                    <DollarIcon color="action" />
                  </Box>
                }
                subheader="Your current airport fees"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">Payment Status</Typography>
                    <Chip 
                      label="1 Overdue" 
                      color="warning" 
                      size="small" 
                      sx={{ bgcolor: '#fff9c4', color: '#f57f17' }} 
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={66} 
                    sx={{ height: 8, borderRadius: 4, mb: 0.5 }} 
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">2/3 Paid</Typography>
                    <Typography variant="caption" color="text.secondary">$700.00 Remaining</Typography>
                  </Box>
                </Box>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fee Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feeData.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell><Typography variant="body2" fontWeight="medium">{fee.type}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{fee.amount}</Typography></TableCell>
                          <TableCell>{getStatusChip(fee.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  startIcon={<FileTextIcon />}
                  onClick={handleDownloadStatement}
                >
                  Download Statement
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Fuel Totals Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Fuel Consumption</Typography>
                    <FuelIcon color="action" />
                  </Box>
                }
                subheader="6-month fuel usage in gallons"
              />
              <CardContent>
                <Box sx={{ height: 240, mb: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fuelData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" name="Fuel" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  {[
                    { label: "Total YTD", value: "6,800 gallons" },
                    { label: "Current Month", value: "800 gallons" },
                    { label: "Avg. Monthly", value: "1,133 gallons" }
                  ].map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        py: 1, 
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography color="text.secondary">{item.label}</Typography>
                      <Typography fontWeight="medium">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="outlined" size="small">
                  View Full History
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;