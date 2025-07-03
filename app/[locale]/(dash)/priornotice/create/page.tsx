"use client";

import { useForm } from '@refinedev/react-hook-form';
import { Create } from '@refinedev/mui';
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';
import { PriorNotice } from "@/types/index";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const PNCreate = () => {
  const t = useTranslations('PN');
  const theme = useTheme();
  const router = useRouter();
  const {
    refineCore: { formLoading, onFinish },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PriorNotice>({
    refineCoreProps: {
      resource: 'priornotice',
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      if (!data.dep_time && !data.arr_time) {
        throw new Error(t("EitherDepartureOrArrivalRequired"));
      }
      
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      );
      
      await onFinish(filteredData);
      router.push('/priornotice');
    } catch (error) {
      console.error("Form submission error:", error);
      // You might want to show this error to the user
    }
  });

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: (e) => {
          e.preventDefault();
          handleFormSubmit();
        },
      }}
      goBack
      title={
        <Typography variant="h4">
          {t("title")}
        </Typography>
      }
    >
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color={theme.palette.error.main}>
              {t("subtitle")}
            </Typography>
          </Grid>

          {/* Departure Time */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('dep_time', {
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: t("InvalidTimeFormat"),
                },
              })}
              error={!!errors.dep_time}
              helperText={errors.dep_time?.message as string}
              defaultValue={null}
              fullWidth
              label={t("DEP (UTC HHMM)")}
              placeholder={t("Enterdeptimehere")}
            />
          </Grid>

          {/* Arrival Time */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('arr_time', {
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: t("InvalidTimeFormat"),
                },
              })}
              error={!!errors.arr_time}
              helperText={errors.arr_time?.message as string}
              defaultValue={null}
              fullWidth
              label={t("ARR (UTC HHMM)")}
              placeholder={t("Enterarrtimehere")}
            />
          </Grid>

          {/* Date Of Flight */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('dof')}
              fullWidth
              type="date"
              label={t("DateOfFlight")}
              defaultValue={new Date().toISOString().split('T')[0]}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Aircraft Registration */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('aircraft', {
                required: t("AircraftRegRequired"),
              })}
              error={!!errors.aircraft}
              helperText={errors.aircraft?.message as string}
              fullWidth
              label={t("Aircraft registration")}
            />
          </Grid>

          {/* MTOW */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('mtow', {
                required: t("MTOWRequired"),
                min: { value: 1, message: t("InvalidMTOW") },
                max: { value: 10000, message: t("MTOWTooHigh") },
                valueAsNumber: true,
              })}
              error={!!errors.mtow}
              helperText={errors.mtow?.message as string}
              fullWidth
              type="number"
              label={t("MTOW (Kg)")}
            />
          </Grid>

          {/* PIC Name */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('pic_name', { 
                required: t("PICNameRequired") 
              })}
              error={!!errors.pic_name}
              helperText={errors.pic_name?.message as string}
              fullWidth
              label={t("PIC (Full name)")}
            />
          </Grid>

          {/* IFR Arrival */}
          <Grid item xs={12}>
            <Controller
              control={control}
              name="ifr_arrival"
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} color="primary" />}
                  label={t("IFR Arrival")}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Create>
  );
};

export default PNCreate;