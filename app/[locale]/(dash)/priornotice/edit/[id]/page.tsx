"use client";

import { useForm } from '@refinedev/react-hook-form';
import { Edit } from '@refinedev/mui';
import {
  Box, Grid, TextField, Checkbox, FormControlLabel, Typography, Autocomplete, IconButton,
  ButtonGroup,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';
import { useParams, useRouter } from 'next/navigation';
import { PriorNotice } from '@/types/index';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect, Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";
import { useProfilePNAircraft, useProfilePNPIC } from '@components/functions/FetchFunctions';
import { useGetIdentity } from '@refinedev/core';

interface AircraftData {
  aircraft: string;
  mtow: number;
}

const PNEdit = () => {
  const t = useTranslations('PN');
  const theme = useTheme();
  const router = useRouter();
  const { id: pnID } = useParams<{ id: string }>();
  const { data: identityData } = useGetIdentity<{ id: string }>();

  const aircrafts = useProfilePNAircraft({ profileId: identityData?.id ?? "" });
  const PICPersons = useProfilePNPIC({ profileId: identityData?.id ?? "" });

  const [aircraftOptions, setAircraftOptions] = useState<AircraftData[]>([]);
  const [picOptions, setPicOptions] = useState<string[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftData | null>(null);
  const [currentMTOW, setCurrentMTOW] = useState<number | ''>('');

  const {
    refineCore: { formLoading, queryResult, onFinish },
    saveButtonProps,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    watch
  } = useForm<PriorNotice>({
    refineCoreProps: {
      resource: 'priornotice',
      action: 'edit',
      id: pnID,
      metaData: {
        transform: (data: PriorNotice) => ({
          ...data,
          status: 'pending',
        }),
      },
    },
    mode: 'onChange',
  });

  const defaultValues = queryResult?.data?.data;

  useEffect(() => {
    if (aircrafts?.length) setAircraftOptions(aircrafts);
    if (PICPersons?.length) setPicOptions(PICPersons);
  }, [aircrafts, PICPersons]);

  useEffect(() => {
    if (defaultValues) {
      setValue('dep_time', defaultValues.dep_time);
      setValue('arr_time', defaultValues.arr_time);
      setValue('dof', defaultValues.dof?.split('T')[0]);
      setValue('aircraft', defaultValues.aircraft);
      setValue('mtow', defaultValues.mtow);
      setValue('pic_name', defaultValues.pic_name);
      setValue('ifr_arrival', defaultValues.ifr_arrival ?? false);

      // Preselect aircraft if found
      const found = aircraftOptions.find(ac => ac.aircraft === defaultValues.aircraft);
      if (found) {
        setSelectedAircraft(found);
        setCurrentMTOW(found.mtow);
      }
    }
  }, [defaultValues, aircraftOptions, setValue]);

  const watchedAircraft = watch('aircraft');

  const handleGoBack = () => router.push('/priornotice');

  const handleAircraftChange = (newValue: AircraftData | string | null) => {
    if (typeof newValue === 'string') {
      setSelectedAircraft(null);
      setValue('aircraft', newValue, { shouldValidate: true });
      setCurrentMTOW('');
    } else if (newValue) {
      setSelectedAircraft(newValue);
      setValue('aircraft', newValue.aircraft, { shouldValidate: true });
      setValue('mtow', newValue.mtow, { shouldValidate: true });
      setCurrentMTOW(newValue.mtow);
    } else {
      setSelectedAircraft(null);
      setValue('aircraft', '', { shouldValidate: true });
      setCurrentMTOW('');
    }
    trigger('aircraft');
  };

  const handleMTOWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setCurrentMTOW(value);
    setValue('mtow', value === '' ? undefined : value, { shouldValidate: true });
  };
  const values = getValues();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = await trigger();

    const values = getValues();
    const dep = values.dep_time?.trim();
    const arr = values.arr_time?.trim();

    const atLeastOneTime = dep || arr;

    if (!atLeastOneTime) {
      alert(t("AtLeastOneTimeRequired")); // Or show toast/snackbar
      return;
    }

    if (!valid) return;

    await onFinish(values);
    router.push('/priornotice');
  };

  const checkValueTime = (time?: string) => {
    return /^([01][0-9]|2[0-3])[0-5][0-9]$/.test(time ?? "");
  };

  const watchedDepTime = watch('dep_time');
  const watchedArrTime = watch('arr_time');

  const [depArrSelected, setDepArrSelected] = useState<"DEP" | "ARR" | "BOTH">('ARR');

  useEffect(() => {
    if (checkValueTime(watchedDepTime) && checkValueTime(watchedArrTime)) {
      setDepArrSelected("BOTH");
    } else if (checkValueTime(watchedDepTime)) {
      setDepArrSelected("DEP");
    } else if (checkValueTime(watchedArrTime)) {
      setDepArrSelected("ARR");
    } else {
      setDepArrSelected("ARR");
    }
  }, [watchedDepTime, watchedArrTime]);

  const handleSelect = (option: "DEP" | "ARR" | "BOTH") => {
      setDepArrSelected(option);
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
          <Typography variant="h4">{t("Edittitle")}</Typography>
        </Box>
      }
    >
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleFormSubmit}>
        <Suspense fallback={<Spinner/>}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" color={theme.palette.error.main}>
                {t("subtitle")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box mt={2}>
                <ButtonGroup variant="contained" fullWidth>
                  <Button
                    onClick={() => handleSelect("DEP")}
                    color={depArrSelected === "DEP" ? "primary" : "inherit"}
                  >
                    DEP
                  </Button>
                  <Button
                    onClick={() => handleSelect("ARR")}
                    color={depArrSelected === "ARR" ? "primary" : "inherit"}
                  >
                    ARR
                  </Button>
                  <Button
                    onClick={() => handleSelect("BOTH")}
                    color={depArrSelected === "BOTH" ? "primary" : "inherit"}
                  >
                    BOTH
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
            {depArrSelected === "BOTH" && (
              <>
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
                    fullWidth
                    label={t("DEP (UTC HHMM)")}
                  />
                </Grid>

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
                    fullWidth
                    label={t("ARR (UTC HHMM)")}
                  />
                </Grid>
              </>
            )}
            {depArrSelected === "DEP" && (
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
                  fullWidth
                  label={t("DEP (UTC HHMM)")}
                />
              </Grid>
            )}
            {depArrSelected === "ARR" && (
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
                  fullWidth
                  label={t("ARR (UTC HHMM)")}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                {...register('dof')}
                fullWidth
                type="date"
                label={t("DateOfFlight")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="aircraft"
                control={control}
                rules={{ required: t("AircraftRequired") }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    options={aircraftOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.aircraft}
                    value={selectedAircraft || value || null}
                    onChange={(_, newValue) => {
                      handleAircraftChange(newValue);
                      onChange(typeof newValue === 'string' ? newValue : newValue?.aircraft || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue !== value) onChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("Aircraft registration")}
                        inputRef={ref}
                        error={!!error}
                        helperText={error?.message}
                        value={watchedAircraft || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>

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
                value={currentMTOW}
                onChange={handleMTOWChange}
                type="number"
                label={t("MTOW (Kg)")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="pic_name"
                control={control}
                rules={{ required: t("PICNameRequired") }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    options={picOptions}
                    value={value || ''}
                    onChange={(_, newValue) => onChange(newValue || '')}
                    onInputChange={(_, newInputValue) => onChange(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("PIC (Full name)")}
                        inputRef={ref}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

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
        </Suspense>
      </Box>
    </Edit>
  );
};

export default PNEdit;
