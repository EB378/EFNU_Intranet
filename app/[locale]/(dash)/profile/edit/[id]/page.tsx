"use client";

import { useForm } from '@refinedev/react-hook-form';
import { Edit } from '@refinedev/mui';
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';

interface PNFormValues {
  from_location: string;
  to_location: string;
  dep_time: string;
  arr_time: string;
  dep_date?: string;
  arr_date?: string;
  aircraft_reg: string;
  mtow: number;
  pic_name: string;
  phone: string;
  email: string;
  ifr_arrival: boolean;
}

const PNEdit = () => {
  const theme = useTheme();
  const {
    refineCore: { formLoading, queryResult },
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<PNFormValues>({
    refineCoreProps: {
      resource: 'pn_forms',
      action: 'edit',
      redirect: false,
    },
  });

  const { data: record } = queryResult;

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={
        <Typography variant="h4">
          Edit Prior Notice (PN) Form
        </Typography>
      }
    >
      <Box component="form" sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color={theme.palette.error.main}>
              All operations outside of 0900-2100 local time are forbidden
            </Typography>
          </Grid>

          {/* Departure Location */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('from_location', {
                required: 'Departure Location is required',
              })}
              defaultValue={record?.data?.from_location}
              error={!!errors.from_location}
              helperText={errors.from_location?.message}
              fullWidth
              label="Departure Location"
            />
          </Grid>

          {/* Arrival Location */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('to_location', {
                required: 'Arrival location is required',
              })}
              defaultValue={record?.data?.to_location}
              error={!!errors.to_location}
              helperText={errors.to_location?.message}
              fullWidth
              label="Arrival Location"
            />
          </Grid>

          {/* Departure Time */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('dep_time', {
                required: 'Departure time is required',
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: 'Invalid time format (HHMM)',
                },
              })}
              defaultValue={record?.data?.dep_time}
              error={!!errors.dep_time}
              helperText={errors.dep_time?.message}
              fullWidth
              label="DEP (local HHMM)"
            />
          </Grid>

          {/* Arrival Time */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('arr_time', {
                required: 'Arrival time is required',
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: 'Invalid time format (HHMM)',
                },
              })}
              defaultValue={record?.data?.arr_time}
              error={!!errors.arr_time}
              helperText={errors.arr_time?.message}
              fullWidth
              label="ARR (local HHMM)"
            />
          </Grid>

          {/* Departure Date */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('dep_date')}
              defaultValue={record?.data?.dep_date || new Date().toISOString().split('T')[0]}
              fullWidth
              type="date"
              label="DEP Date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Arrival Date */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('arr_date')}
              defaultValue={record?.data?.arr_date || new Date().toISOString().split('T')[0]}
              fullWidth
              type="date"
              label="ARR Date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Aircraft Registration */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('aircraft_reg', {
                required: 'Aircraft registration is required',
              })}
              defaultValue={record?.data?.aircraft_reg}
              error={!!errors.aircraft_reg}
              helperText={errors.aircraft_reg?.message}
              fullWidth
              label="Aircraft registration"
            />
          </Grid>

          {/* MTOW */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('mtow', {
                required: 'MTOW is required',
                min: { value: 1, message: 'Invalid MTOW' },
                max: { value: 10000, message: 'MTOW too high' },
                valueAsNumber: true,
              })}
              defaultValue={record?.data?.mtow}
              error={!!errors.mtow}
              helperText={errors.mtow?.message}
              fullWidth
              type="number"
              label="MTOW (Kg)"
            />
          </Grid>

          {/* PIC Name */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('pic_name', { required: 'PIC name is required' })}
              defaultValue={record?.data?.pic_name}
              error={!!errors.pic_name}
              helperText={errors.pic_name?.message}
              fullWidth
              label="PIC (Full name)"
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[0-9\s-]+$/,
                  message: 'Invalid phone number',
                },
              })}
              defaultValue={record?.data?.phone}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              label="Phone"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              defaultValue={record?.data?.email}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              label="PIC e-mail (for billing)"
            />
          </Grid>

          {/* IFR Arrival */}
          <Grid item xs={12}>
            <Controller
              control={control}
              name="ifr_arrival"
              defaultValue={record?.data?.ifr_arrival || false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label="IFR Arrival"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
};

export default PNEdit;