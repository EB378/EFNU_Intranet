"use client";

import { useForm } from '@refinedev/react-hook-form';
import { Create } from '@refinedev/mui';
import React, { useState, useEffect, Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Autocomplete,
  ButtonGroup,
  Button
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';
import { PriorNotice } from "@/types/index";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useProfilePNAircraft, useProfilePNPIC } from '@components/functions/FetchFunctions';
import { useGetIdentity, useUpdate, useNotification } from '@refinedev/core';

interface AircraftData {
  aircraft: string;
  mtow: number;
}

type UserProfile = {
  id: string;
  presaved: {
    aircrafts: AircraftData[];
    PIC: string[];
  };
};

const PNCreate = () => {
  const t = useTranslations('PN');
  const theme = useTheme();
  const router = useRouter();
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const { open } = useNotification();
  const { mutate: updateProfile } = useUpdate<UserProfile>();

  const [aircraftOptions, setAircraftOptions] = useState<AircraftData[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftData | null>(null);
  const [currentMTOW, setCurrentMTOW] = useState<number | ''>('');
  const [picOptions, setPicOptions] = useState<string[]>([]);

  const aircrafts = useProfilePNAircraft({ profileId: identityData?.id ?? "" });
  const PICPersons = useProfilePNPIC({ profileId: identityData?.id ?? "" });


  // Initialize aircraft options
  useEffect(() => {
    if (aircrafts && aircrafts.length > 0) {
      setAircraftOptions(aircrafts);
    }
  }, [aircrafts]);

  // Initialize PIC options
  useEffect(() => {
    if (PICPersons && PICPersons.length > 0) {
      setPicOptions(PICPersons);
    }
  }, [PICPersons]);

  // Update MTOW when aircraft changes
  useEffect(() => {
    if (selectedAircraft) {
      setCurrentMTOW(selectedAircraft.mtow);
      setValue('mtow', selectedAircraft.mtow, { shouldValidate: true });
    }
  }, [selectedAircraft]);

  const {
    refineCore: { formLoading, onFinish },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<PriorNotice>({
    refineCoreProps: {
      resource: 'priornotice',
    },
    mode: 'onChange',
    defaultValues: {
      aircraft: '',
      mtow: undefined,
    },
  });

  const watchedAircraft = watch('aircraft');

  const handleSaveAircraftAndPIC = async (aircraftData: AircraftData | null, picName: string | null) => {
    try {
      const updates: Partial<UserProfile['presaved']> = {};
      let shouldUpdate = false;

      // Handle aircraft update
      if (aircraftData?.aircraft && aircraftData.mtow) {
        const currentAircrafts = aircrafts || [];
        const existingAircraftIndex = currentAircrafts.findIndex(
          ac => ac.aircraft.toLowerCase() === aircraftData.aircraft.toLowerCase()
        );

        if (existingAircraftIndex >= 0) {
          const updatedAircrafts = [...currentAircrafts];
          updatedAircrafts[existingAircraftIndex] = aircraftData;
          updates.aircrafts = updatedAircrafts;
          setAircraftOptions(updatedAircrafts);
        } else {
          updates.aircrafts = [...currentAircrafts, aircraftData];
          setAircraftOptions(prev => [...prev, aircraftData]);
        }
        shouldUpdate = true;
      }

      // Handle PIC update
      if (picName) {
        const currentPICs = PICPersons || [];
        const picExists = currentPICs.some(pic => 
          pic.toLowerCase() === picName.toLowerCase()
        );

        if (!picExists) {
          updates.PIC = [...currentPICs, picName];
          setPicOptions(prev => [...prev, picName]);
          shouldUpdate = true;
        }
      }

      // Perform the update if needed
      if (shouldUpdate) {
        await updateProfile({
          resource: 'profiles',
          id: identityData?.id ?? "",
          values: {
            presaved: {
              ...(updates.aircrafts ? { aircrafts: updates.aircrafts } : { aircrafts: aircrafts || [] }),
              ...(updates.PIC ? { PIC: updates.PIC } : { PIC: PICPersons || [] }),
            },
          },
        }, {
          onSuccess: () => {
            open?.({
              type: 'success',
              message: 'Profile updated successfully',
            });
          },
        });
      }
    } catch (error) {
      open?.({
        type: 'error',
        message: 'Failed to update profile',
      });
      console.error("Failed to save aircraft and PIC:", error);
    }
  };

  // Updated handleFormSubmit to use the combined function
  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      const processedData = {
        ...data,
        dep_time: data.dep_time?.trim() || undefined,
        arr_time: data.arr_time?.trim() || undefined,
      };

      if (!processedData.dep_time && !processedData.arr_time) {
        throw new Error(t("EitherDepartureOrArrivalRequired"));
      }

      // Save both aircraft and PIC if needed
      const aircraftData = data.aircraft && data.mtow 
        ? { aircraft: data.aircraft, mtow: data.mtow } 
        : null;
      
      await handleSaveAircraftAndPIC(aircraftData, data.pic_name || null);
      
      await onFinish(processedData);
      router.push('/priornotice');
    } catch (error) {
      open?.({
        type: 'error',
        message: error instanceof Error ? error.message : 'Form submission failed',
      });
    }
  });

  const handleAircraftChange = (newValue: AircraftData | string | null) => {
    if (typeof newValue === 'string') {
      // Free text input
      setSelectedAircraft(null);
      setValue('aircraft', newValue, { shouldValidate: true });
      setCurrentMTOW('');
    } else if (newValue) {
      // Selected from dropdown
      setSelectedAircraft(newValue);
      setValue('aircraft', newValue.aircraft, { shouldValidate: true });
      setValue('mtow', newValue.mtow, { shouldValidate: true });
    } else {
      // Cleared
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

  const checkValueTime = (time?: string) => {
    const str = time ?? "";

    if (!/^\d{1,4}$/.test(str)) return false;

    if (str.length < 4) return true;

    // If 4 digits, validate HHMM format
    const hour = parseInt(str.slice(0, 2), 10);
    const minute = parseInt(str.slice(2), 10);

    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
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
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        disabled: !isValid,
        onClick: async (e) => {
          e.preventDefault();
          const isValid = await trigger();
          if (isValid) {
            handleFormSubmit();
          }
        },
      }}
      goBack
      title={
        <Typography variant="h4">
          {t("title")}
        </Typography>
      }
    >
      <Box component="form" sx={{ mt: 3, minHeight: '60vh' }} onSubmit={handleFormSubmit}>
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
                    placeholder={t("Enterdeptimehere")}
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
                    placeholder={t("Enterarrtimehere")}
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
                  placeholder={t("Enterdeptimehere")}
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
                  placeholder={t("Enterarrtimehere")}
                />
              </Grid>
            )}

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

            <Grid item xs={12} md={6}>
              <Controller
                name="aircraft"
                control={control}
                rules={{ required: t("AircraftRequired") }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    options={aircraftOptions}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.aircraft
                    }
                    value={selectedAircraft || value || null}
                    onChange={(_, newValue) => {
                      handleAircraftChange(newValue);
                      onChange(newValue ? (typeof newValue === 'string' ? newValue : newValue.aircraft) : '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      if (newInputValue !== value) {
                        onChange(newInputValue);
                      }
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
                    renderOption={(props, option) => (
                      <li {...props} key={typeof option === 'string' ? option : option.aircraft}>
                        {typeof option === 'string' ? option : option.aircraft}
                      </li>
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
                    onChange={(_, newValue) => {
                      onChange(newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      onChange(newInputValue);
                    }}
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
    </Create>
  );
};

export default PNCreate;