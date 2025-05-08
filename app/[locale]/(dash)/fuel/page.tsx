"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Chip,
  Divider,
  IconButton,
  Slide,
  styled
} from "@mui/material";
import { useTheme } from "@hooks/useTheme";
import { useForm, useGetIdentity, useList } from "@refinedev/core";
import { useTranslations } from "next-intl";
import {
  LocalGasStation,
  Flight,
  AirplanemodeActive,
  Recycling,
  EventAvailable,
  Close,
  Email,
  Phone,
  Place,
  Info
} from "@mui/icons-material";
import { List, SaveButton } from "@refinedev/mui";
import { motion } from "framer-motion";

// Styled components
const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.common.white,
  borderRadius: 20,
  boxShadow: theme.shadows[10],
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[16]
  }
}));

const HoverButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4]
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
    },
  },
}));

type FuelOption = {
  label: string;
  capacity?: number;
  remaining?: number;
  price?: number;
  value: string;
  icon: JSX.Element;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  remarks?: string;
};

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

export default function FuelPage() {
  const theme = useTheme();
  const t = useTranslations("Fuel");
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const [selectedFuel, setSelectedFuel ] = useState<string>("");
  const [createModalOpen, setCreateModalOpen ] = useState(false);
  const [ myRefulingsModalOpen, setMyRefulingsModalOpen ] = useState(false);
  const [contactModalOpen, setContactModalOpen ] = useState(false);
  const [tankStatusModalOpen, setTankStatusModalOpen] = useState(false);

  const { 
    formLoading,
    onFinish,
  } = useForm<FuelValues>({
    resource: 'fuel',
    action: "create",
    redirect: false,
    onMutationSuccess: () => {
      setCreateModalOpen(false);
    }
  });

  const { data: MyRefulingsData } = useList<FuelItem>({
    resource: "fuel",
    filters: [
      {
        field: "userid",
        operator: "eq",
        value: identityData?.id || "",
      },
    ],
    queryOptions: {
      enabled: !!identityData?.id,
    },
  });

  console.log(MyRefulingsData);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onFinish({
      aircraft: formData.get("aircraft") as string,
      amount: Number(formData.get("amount")),
      fuel: selectedFuel,
      userid: identityData?.id || ""
    });
  };

  const fuelOptions: FuelOption[] = [
    { 
      label: "Avgas", 
      capacity: 3000,
      remaining: 783.50,
      price: 3.50,
      value: "avgas", 
      icon: <LocalGasStation fontSize="large" />, 
      color: "warning",
      remarks: "Aviation gasoline, commonly used in piston-engine aircraft."
    },
    { 
      label: "E98", 
      capacity: 3000,
      remaining: 783.50,
      price: 1.80,
      value: "e95", 
      icon: <Recycling fontSize="large" />, 
      color: "success",
      remarks: "Ethanol-blended gasoline, suitable for various engines."
    },
    { 
      label: "Jet Fuel", 
      capacity: 3000,
      remaining: 783.50,
      price: 2.00,
      value: "jet-fuel", 
      icon: <Flight fontSize="large" />, 
      color: "primary",
      remarks: "Jet fuel, ideal for turbine-engine aircraft."
    },
    { 
      label: "Be95SE", 
      capacity: 3000,
      remaining: 783.50,
      price: 1.60,
      value: "small-aircraft", 
      icon: <AirplanemodeActive fontSize="large" />, 
      color: "secondary",
      remarks: "Specialized petrol for small aircraft engines."
    }
  ];

  return (
    <Box>
      {/* Create New Refueling Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={createModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxWidth: "100vw",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
            p: 3,
            border: `2px solid ${theme.palette.primary.main}`
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalGasStation color="primary" />
                Fueling Details
              </Typography>
              <IconButton onClick={() => setCreateModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleFormSubmit}>
              <Box sx={{ mb: 2 }}>
                <StyledTextField
                  fullWidth
                  required
                  name="amount"
                  label="Amount (Liters)"
                  type="number"
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <StyledTextField
                  fullWidth
                  required
                  name="aircraft"
                  label="Aircraft Information"
                  variant="outlined"
                  placeholder="e.g., Boeing 737-800"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <SaveButton
                fullWidth
                loading={formLoading}
                type="submit"
                sx={{ 
                  height: 45, 
                  borderRadius: 14,
                  textTransform: 'none',
                  fontSize: 16
                }}
              />
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* My Refuelings Modal */}
      <Modal
        open={myRefulingsModalOpen}
        onClose={() => setMyRefulingsModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={myRefulingsModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxWidth: "100vw",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
            p: 3
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventAvailable color="primary" />
                Fueling History
              </Typography>
              <IconButton onClick={() => setMyRefulingsModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
              {MyRefulingsData?.data?.map((item: FuelItem) => (
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
                          label={item.fuel.toUpperCase()} 
                          size="small" 
                          color="primary"
                          sx={{ borderRadius: 2, mt: 0.5 }}
                        />
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          {item.createdAt}
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

      {/* Contact Modal */}
      <Modal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        closeAfterTransition
      >
        <Slide in={contactModalOpen} direction="up">
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            maxWidth: "100vw",
            margin: '0 auto'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                Contact Us
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
                    <Phone fontSize="small" /> +358 123 456 789
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Place fontSize="small" /> 123 Aviation St, Helsinki
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We&apos;re available 24/7 for your fueling needs. Reach out for:
                  </Typography>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li><Typography variant="body2">Emergency support</Typography></li>
                    <li><Typography variant="body2">Bulk orders</Typography></li>
                    <li><Typography variant="body2">Service inquiries</Typography></li>
                  </ul>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Slide>
      </Modal>

      {/* Fueling Status Modal */}
      <Modal
        open={tankStatusModalOpen}
        onClose={() => setTankStatusModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={tankStatusModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxWidth: "100vw",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,
            p: 3
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalGasStation color="primary" />
                Tank Status
              </Typography>
              <IconButton onClick={() => setTankStatusModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ 
                  overflowX: 'auto',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white
                      }}>
                        <th style={{ padding: '12px', textAlign: 'left', minWidth: 120 }}>Quality</th>
                        <th style={{ padding: '12px', textAlign: 'right', minWidth: 100 }}>Capacity (L)</th>
                        <th style={{ padding: '12px', textAlign: 'right', minWidth: 100 }}>Remaining (L)</th>
                        <th style={{ padding: '12px', textAlign: 'right', minWidth: 100 }}>€/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fuelOptions.map((fuel, index) => (
                        <tr 
                          key={fuel.label}
                          style={{ 
                            backgroundColor: index % 2 === 0 
                              ? theme.palette.action.hover 
                              : 'transparent',
                            borderBottom: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <td style={{ padding: '12px', fontWeight: 600 }}>{fuel.label}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>{fuel?.capacity?.toLocaleString() || 'N/A'}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>{fuel?.remaining?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>€{fuel?.price?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Remarks
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)'
                }}>
                  {fuelOptions.map((item) => (
                    <Box key={item.value} sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        color: 'text.secondary',
                        fontWeight: 500 
                      }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2">{item?.remarks}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>


      {/* Main Content */}
      <Grid container spacing={3} justifyContent="center" sx={{ p: 4}}>
        <Grid item xs={12} md={6}>
          <GradientCard>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 700, 
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                ✈️ Fuel Services
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {fuelOptions.map((option) => (
                  <Grid item xs={6} key={option.value}>
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <HoverButton
                        fullWidth
                        variant="contained"
                        color={option.color}
                        onClick={() => {
                          setSelectedFuel(option.value);
                          setCreateModalOpen(true);
                        }}
                        startIcon={React.cloneElement(option.icon, { sx: { fontSize: 32 } })}
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
                          From €{option?.price}/L
                        </Typography>
                      </HoverButton>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </GradientCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GradientCard>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 700, 
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                🛠️ Management
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <HoverButton
                    variant="contained"
                    color="secondary"
                    onClick={() => setMyRefulingsModalOpen(true)}
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
                      <Typography variant="h6" fontWeight={600}>Refueling History</Typography>
                      <Typography variant="caption">View past transactions</Typography>
                    </Box>
                  </HoverButton>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <HoverButton
                    variant="contained"
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
                      <Typography variant="h6" fontWeight={600}>Fuel Availability</Typography>
                      <Typography variant="caption">Check current stock</Typography>
                    </Box>
                  </HoverButton>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <HoverButton
                    variant="contained"
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
                      <Typography variant="h6" fontWeight={600}>Support Center</Typography>
                      <Typography variant="caption">24/7 assistance</Typography>
                    </Box>
                  </HoverButton>
                </motion.div>
              </Stack>
            </CardContent>
          </GradientCard>
        </Grid>
      </Grid>
    </Box>
  );
}