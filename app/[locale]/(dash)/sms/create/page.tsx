"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Chip
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Add, Warning, Close, CloudUpload, LocationOn } from "@mui/icons-material";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

type FormValues = {
  title: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  reportedBy: string;
  attachments: File[];
};

const ReportCreatePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { 
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      category: '',
      severity: 'medium',
      description: '',
      location: '',
      reportedBy: 'John D.', // Default to current user
      attachments: []
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Report created:', data);
      setSuccess(true);
      reset();
      setFiles([]);
      setTimeout(() => router.push('/safety-reports'), 2000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Add />
          </Avatar>
          New Safety Report
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Report safety concerns or incidents using this form
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Report Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* Category & Severity */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Category">
                      <MenuItem value="Fire Safety">Fire Safety</MenuItem>
                      <MenuItem value="Electrical">Electrical</MenuItem>
                      <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                      <MenuItem value="Equipment">Equipment</MenuItem>
                      <MenuItem value="Structural">Structural</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severity Level</InputLabel>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Severity Level">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Detailed Description"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <Controller
                name="location"
                control={control}
                rules={{ required: 'Location is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    InputProps={{
                      startAdornment: (
                        <LocationOn color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                )}
              />
            </Grid>

            {/* Attachments */}
            <Grid item xs={12}>
              <input
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload Evidence
                </Button>
              </label>

              {files.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => removeFile(index)}
                  sx={{ m: 0.5 }}
                  deleteIcon={<Close />}
                />
              ))}
            </Grid>

            {/* Submit Area */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                justifyContent: 'flex-end',
                borderTop: 1,
                borderColor: 'divider',
                pt: 3
              }}>
                <NextLink href="/safety-reports" passHref>
                  <Button variant="outlined">Cancel</Button>
                </NextLink>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Warning />}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Create Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Report submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportCreatePage;