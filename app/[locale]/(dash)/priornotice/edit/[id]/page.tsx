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
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';
import { useParams, useRouter } from "next/navigation";
import { PriorNotice } from "@/types/index";
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const PNEdit = () => {
  const t = useTranslations('PN');
  const { id: pnID } = useParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const {
    refineCore: { formLoading, queryResult, onFinish },
    saveButtonProps,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PriorNotice>({
    refineCoreProps: {
      resource: 'priornotice',
      action: 'edit',
      id: pnID,
      metaData: {
        transform: (data: PriorNotice) => ({
          ...data,
          status: 'pending' // Add status field with pending value
        })
      }
    },
  });

  const defaultValues = queryResult?.data?.data;
  const handleGoBack = () => {
    router.push('/priornotice'); // or router.back() if you want to go to the previous page
  };

  // Set form values when data is loaded
  useEffect(() => {
    if (defaultValues) {
      setValue('dep_time', defaultValues.dep_time);
      setValue('arr_time', defaultValues.arr_time);
      setValue('dof', defaultValues.dof?.split('T')[0]);
      setValue('aircraft', defaultValues.aircraft);
      setValue('mtow', defaultValues.mtow);
      setValue('pic_name', defaultValues.pic_name);
      setValue('ifr_arrival', defaultValues.ifr_arrival || false);
    }
  }, [defaultValues, setValue]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onFinish(getValues());
      router.push('/priornotice');
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: (e) => {
          e.preventDefault();
          handleFormSubmit(e);
        },
      }}
      goBack
      title={
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleGoBack} sx={{ p: 0 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {t("Edittitle")}
          </Typography>
        </Box>
      }
      headerProps={{
        sx: {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }
      }}
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
                required: t("DepartureTimeRequired"),
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: t("InvalidTimeFormat"),
                },
              })}
              error={!!errors.dep_time}
              helperText={errors.dep_time?.message as string}
              fullWidth
              margin="normal"  
              sx={{ 
                marginBottom: 2,
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  bottom: '-20px'
                }}}
              label={t("DEP (UTC HHMM)")}
            />
          </Grid>

          {/* Arrival Time */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('arr_time', {
                required: t("ArrivalTimeRequired"),
                pattern: {
                  value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                  message: t("InvalidTimeFormat"),
                },
              })}
              error={!!errors.arr_time}
              helperText={errors.arr_time?.message as string}
              fullWidth
              sx={{ 
                marginBottom: 2,
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  bottom: '-20px'
                }}}
                variant="outlined"
              margin="normal"  
              label={t("ARR (UTC HHMM)")}
            />
          </Grid>

          {/* Date Of Flight */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('dof')}
              fullWidth
              type="date"
              margin="normal"  
              label={t("DateOfFlight")}
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
              margin="normal"  
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
              margin="normal"  
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
              margin="normal"  
              label={t("PIC (Full name)")}
            />
          </Grid>

          {/* IFR Arrival */}
          <Grid item xs={12}>
            <Controller
              control={control}
              name="ifr_arrival"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label={t("IFR Arrival")}
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