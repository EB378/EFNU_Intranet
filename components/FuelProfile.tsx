"use client";

import React from "react";
import { BarChart } from "recharts";
import { Grid, Card, CardHeader, Box, Typography, CardContent, Tooltip, CardActions, Button } from "@mui/material";
import { useList } from "@refinedev/core";
import { FuelIcon } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Bar } from "recharts";

interface FuelValues {
    aircraft: string;
    amount: number;
    fuel: string;
    userid: string;
    createdAt: string;
  }
  interface FuelItem extends FuelValues {
    id: string;
    createdAt: string;
  }
  interface ProcessedFuelData {
    month: string;
    amount: number;
  }
  
  interface FuelStats {
    totalYTD: number;
    currentMonth: number;
    monthlyAverage: number;
  }
  
  export function FuelData({ profileId }: { profileId: string }) {
    const { data: MyRefuelingsData } = useList<FuelItem>({
      resource: "fuel",
      filters: [{ field: "userid", operator: "eq", value: profileId }],
      queryOptions: { enabled: !!profileId },
    });
    console.log("MyRefuelingsData:", MyRefuelingsData);
  
    const processFuelData = (): [ProcessedFuelData[], FuelStats] => {
      if (!MyRefuelingsData?.data) return [[], { totalYTD: 0, currentMonth: 0, monthlyAverage: 0 }];
  
      // Group data by month and calculate totals
      const monthlyTotals: Record<string, number> = {};
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
  
      // Initialize last 6 months with zeros
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM format
      }).reverse();
  
      MyRefuelingsData.data.forEach((entry) => {
        const entryDate = new Date(entry.createdAt);
        if (entryDate >= sixMonthsAgo) {
          const monthKey = entryDate.toLocaleString('default', { month: 'short' }) + ' ' + entryDate.getFullYear().toString().slice(-2);
          monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + entry.amount;
        }
      });
  
      // Create chart data with all months, filling in zeros where needed
      const fuelData = months.map(monthStr => {
        const date = new Date(monthStr + '-01');
        const monthLabel = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear().toString().slice(-2);
        return {
          month: monthLabel,
          amount: monthlyTotals[monthLabel] || 0
        };
      });
  
      // Calculate statistics
      const totalYTD = fuelData.reduce((sum, entry) => sum + entry.amount, 0);
      const currentMonth = fuelData[fuelData.length - 1]?.amount || 0;
      const monthlyAverage = totalYTD / 6;
  
      return [fuelData, { totalYTD, currentMonth, monthlyAverage }];
    };
    console.log("processFuelData:", processFuelData);
  
    const [fuelData, stats] = processFuelData();
    console.log("Fuel Data:", fuelData);
    console.log("Fuel Stats:", stats);
  
    if (!MyRefuelingsData?.data) return null;
  
    return (
      <Grid item xs={12} md={4}>
        <Card elevation={2} sx={{ 
          borderRadius: '12px',
          boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
        }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Fuel Consumption</Typography>
                <FuelIcon color="action" />
              </Box>
            }
            subheader="Beta Testing"
          />
          <CardContent>
            <Box sx={{ height: 240, mb: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fuelData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip title="Fuel Usage">
                    <span />
                  </Tooltip>
                  <Bar dataKey="amount" name="Fuel" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box>
              {[
                { label: "Total YTD", value: `${stats.totalYTD.toLocaleString()} gallons` },
                { label: "Current Month", value: `${stats.currentMonth.toLocaleString()} gallons` },
                { label: "Avg. Monthly", value: `${Math.round(stats.monthlyAverage).toLocaleString()} gallons` }
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
            <Button fullWidth variant="outlined" size="small" href="/fuel">
              Go To Fuel Management
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }