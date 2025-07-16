"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { Spinner } from "@components/ui/Spinner";
import { useGetIdentity, useList } from "@refinedev/core";
import { 
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  LinearProgress,
  Chip,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Skeleton,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Divider,
  IconButton,
  Slide,
  styled
} from "@mui/material";
import { useTheme } from "@hooks/useTheme";
import { useTranslations } from "next-intl";
import {
  LocalGasStation,
  EventAvailable,
  Close,
  Email,
  Phone,
  Place,
  Info,
  AttachMoney as DollarIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { FuelOption, FuelingValues, FuelItem, OrganisationData, AircraftData } from '@/types/index';
import { FuelName, ProfileName } from "@/components/functions/FetchFunctions";
import { Controller, useWatch } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";

const HoverButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4]
  }
}));

const FuelPage = () => {
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const t = useTranslations("Fuel");
  const theme = useTheme();
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [myRefuelingsModalOpen, setMyRefuelingsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [tankStatusModalOpen, setTankStatusModalOpen] = useState(false);
  const [billedToType, setBilledToType] = useState<'profile' | 'organisation'>('profile');

  const { data: fuels } = useList<FuelOption>({
    resource: "fuels",
  });

  const {
    control,
    register,
    handleSubmit,
    refineCore: { onFinish },
  } = useForm<FuelingValues>({
    defaultValues: {
      aircraft: "",
      billed_to: identityData?.id || "",
    },
    refineCoreProps: {
      resource: 'fuelings',
      action: "create",
      redirect: false,
      onMutationSuccess: () => {
        setCreateModalOpen(false);
      }
    }
  });

  const { data: myRefuelingsData } = useList<FuelItem>({
    resource: "fuelings",
    filters: [
      {
        field: "uid",
        operator: "eq",
        value: identityData?.id || "",
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    queryOptions: {
      enabled: !!identityData?.id,
    },
  });

  const { data: organisationData } = useList<OrganisationData>({
    resource: "organisation",
  })
  
  const { data: aircraftData } = useList<AircraftData>({
    resource: "aircraft",
  })

  const billedTo = useWatch({ control, name: "billed_to" });

  useEffect(() => {
    if (billedTo === identityData?.id) {
      setBilledToType('profile');
    } else {
      setBilledToType('organisation');
    }
  }, [billedTo, identityData?.id]);

  const filteredAircraft = billedTo && billedTo !== identityData?.id
  ? aircraftData?.data?.filter((ac: AircraftData) => {
      const org = organisationData?.data?.find(o => o.id === billedTo);
      return org?.aircraft?.includes(ac.id);
    })
  : aircraftData?.data;

  const handleFormSubmit = handleSubmit((data) => {
    onFinish({
      aircraft: data.aircraft,
      amount: Number(data.amount),
      fuel: selectedFuel,
      billed_to: data.billed_to,
      billed_to_type: billedToType,
    });
  });


  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      {/* Create New Refueling Modal */}
      <Suspense fallback={<Spinner/>}>
        <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxWidth: "95vw",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
            p: 3,
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" gutterBottom>
                <LocalGasStation /> {t("Create.RecordFuelAddition")}
              </Typography>
              <IconButton onClick={() => setCreateModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t("Create.AddingTo")}: {fuels?.data?.find(f => f.id === selectedFuel)?.label}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    {...register("amount", { valueAsNumber: true })}
                    label={t("Create.AmountAdded")}
                    type="number"
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Billed To</InputLabel>
                    <Select
                      {...register("billed_to")}
                      defaultValue=""
                      label="Billed To"
                    >
                      <MenuItem value={identityData?.id}>Self</MenuItem>
                      {organisationData?.data?.map((option: OrganisationData) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="aircraft"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        freeSolo
                        options={filteredAircraft?.map((ac) => ({
                          label: ac.id.toUpperCase(),
                          value: ac.id,
                        })) || []}
                        onChange={(_, data) => field.onChange(data?.value || "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("Create.AircraftRegistration")}
                            required
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                >
                  
                  {t("Create.RecordFuelAddition")}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Suspense>

      {/* My Refuelings Modal */}
      <Suspense fallback={<Spinner/>}>
        <Modal
          open={myRefuelingsModalOpen}
          onClose={() => setMyRefuelingsModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={myRefuelingsModalOpen}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              maxWidth: "95vw",
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 4,
              p: 3
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventAvailable color="primary" />
                  {t("FuelingHistory")}
                </Typography>
                <IconButton onClick={() => setMyRefuelingsModalOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                {myRefuelingsData?.data?.map((item: FuelItem) => (
                  <Card 
                    key={item.id} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {item.aircraft}
                          </Typography>
                          <Chip 
                            label={<FuelName id={item.fuel} />}
                            size="small" 
                            color="primary"
                            sx={{ borderRadius: 2, mt: 0.5 }}
                          />
                          <Typography variant="body2">
                            {t("Billed_to")}: <ProfileName profileId={item.billed_to}/>
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {item.amount}L
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Suspense>

      {/* Contact Modal */}
      <Suspense fallback={<Spinner/>}>
        <Modal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          closeAfterTransition
        >
          <Slide in={contactModalOpen} direction="up">
            <Box sx={{
              position: 'absolute',
              bottom: "10vh", 
              left: 0,
              right: 0,
              bgcolor: 'background.paper',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              p: 3,
              maxWidth: "95vw",
              margin: '0 auto'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email color="primary" />
                  {t("Contact.ContactUs")}
                </Typography>
                <IconButton onClick={() => setContactModalOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                  }}>
                    <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" /> fuel@efnu.fi
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" /> +358 40 6655846
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Place fontSize="small" /> Lentokentäntie 5, 03100 Nummela
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t("Contact.Subtitle")}:
                    </Typography>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      <li><Typography variant="body2">{t("Contact.EmergencySupport")}</Typography></li>
                      <li><Typography variant="body2">{t("Contact.BulkOrders")}</Typography></li>
                      <li><Typography variant="body2">{t("Contact.ServiceInquiries")}</Typography></li>
                    </ul>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Slide>
        </Modal>
      </Suspense>

      {/* Fueling Status Modal */}
      <Suspense fallback={<Spinner/>}>
        <Modal open={tankStatusModalOpen} onClose={() => setTankStatusModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxWidth: "95vw",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
            p: 3,
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" gutterBottom>
                <LocalGasStation /> {t("Status.FuelTankEstimates")}
              </Typography>
              <IconButton onClick={() => setTankStatusModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {t("Status.subtitle")}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("Status.FuelType")}</TableCell>
                    <TableCell align="right">{t("Status.Capacity")}</TableCell>
                    <TableCell align="right">{t("Status.Estimated")}</TableCell>
                    <TableCell align="right">{t("Status.percentFull")}</TableCell>
                    <TableCell align="right">{t("Status.LastAdded")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fuels?.data?.map((fuel: FuelOption) => {
                    const percent = (fuel?.remaining ?? 0) / (fuel?.capacity ?? 1) * 100;
                    const lastAdded = fuel.lastFueling?.toLocaleDateString() || 'Never';
                    
                    return (
                      <TableRow key={fuel.id}>
                        <TableCell>
                          <Chip 
                            label={fuel.label} 
                            sx={{ backgroundColor: fuel.color, color: 'white' }} 
                          />
                        </TableCell>
                        <TableCell align="right">{fuel.capacity}L</TableCell>
                        <TableCell align="right">
                          ~{fuel?.remaining?.toFixed(1)}L
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress 
                              variant="determinate" 
                              value={percent} 
                              sx={{ width: 60, height: 8 }}
                            />
                            {percent.toFixed(0)}%
                          </Box>
                        </TableCell>
                        <TableCell align="right">{lastAdded}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                {t("Status.Details")}
              </Typography>
            </Box>
          </Box>
        </Modal>
      </Suspense>

      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t("Title")}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Fueling options */}
          <Suspense fallback={<Spinner/>}>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ 
                borderRadius: '12px',
                boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{t("ReportFuel")}</Typography>
                    </Box>
                  }
                  subheader={t("ReportFuel")}
                />
                <CardContent>
                  <Suspense fallback={
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {Array(4).fill(0).map((_, i) => (
                        <Grid item xs={6} key={4}>
                          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
                        </Grid>
                      ))}
                    
                  </Grid>
                  }>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {fuels?.data?.map((option: FuelOption) => (
                      <Grid item xs={6} key={option.value}>
                        <motion.div whileHover={{ scale: 1.03 }}>
                          <HoverButton
                            fullWidth
                            variant="outlined"
                            color={option.color as "primary" | "secondary" | "info" | "success" | "warning" | "error"}
                            onClick={() => {
                              setSelectedFuel(option.id);
                              setCreateModalOpen(true);
                            }}
                            sx={{
                              height: 120,
                              maxWidth: "100vw",
                              borderRadius: 3,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              '& .MuiButton-startIcon': {
                                margin: 0,
                                mb: 1
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              €{option?.price}/L
                            </Typography>
                          </HoverButton>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                  </Suspense>
                </CardContent>
              </Card>
            </Grid>
          </Suspense>

          {/* Misc */}
          <Suspense fallback={<Spinner/>}>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ 
                borderRadius: '12px',
                boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{t("FuelManagement")}</Typography>
                      <DollarIcon color="action" />
                    </Box>
                  }
                  subheader={t("subheader")}
                />
                <CardContent>
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HoverButton
                        variant="outlined"
                        color="secondary"
                        onClick={() => setMyRefuelingsModalOpen(true)}
                        startIcon={<EventAvailable sx={{ fontSize: 32 }} />}
                        sx={{
                          height: 80,
                          width: '100%',
                          maxWidth: "100vw",
                          alignSelf: 'center',
                          borderRadius: 3,
                          justifyContent: 'flex-start',
                          px: 3,
                          textTransform: 'none'
                        }}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight={600}>{t("RefuelingHistory")}</Typography>
                          <Typography variant="caption">{t("ViewPastTransactions")}</Typography>
                        </Box>
                      </HoverButton>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HoverButton
                        variant="outlined"
                        color="info"
                        onClick={() => setTankStatusModalOpen(true)}
                        startIcon={<Info sx={{ fontSize: 32 }} />}
                        sx={{
                          height: 80,
                          width: '100%',
                          maxWidth: "100vw",
                          alignSelf: 'center',
                          borderRadius: 3,
                          justifyContent: 'flex-start',
                          px: 3,
                          textTransform: 'none'
                        }}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight={600}>{t("FuelAvailability")}</Typography>
                          <Typography variant="caption">{t("CurrentTankEstimates")}</Typography>
                        </Box>
                      </HoverButton>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HoverButton
                        variant="outlined"
                        color="success"
                        onClick={() => setContactModalOpen(true)}
                        startIcon={<Email sx={{ fontSize: 32 }} />}
                        sx={{
                          height: 80,
                          width: '100%',
                          maxWidth: "100vw",
                          alignSelf: 'center',
                          borderRadius: 3,
                          justifyContent: 'flex-start',
                          px: 3,
                          textTransform: 'none'
                        }}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight={600}>{t("SupportCenter")}</Typography>
                          <Typography variant="caption">{t("assistance")}</Typography>
                        </Box>
                      </HoverButton>
                    </motion.div>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Suspense>
        </Grid>
      </Container>
    </Box>
  );
};

export default FuelPage;