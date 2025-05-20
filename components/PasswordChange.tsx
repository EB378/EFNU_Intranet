"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNotification } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordChangeBlock = () => {
  const { open } = useNotification();
  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id; // Adjust this based on your auth setup
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleClickShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {

      const response = await fetch('/api/users/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId,  // You need to provide this
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      }),
    });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Password update failed");
      }

      open?.({
        type: "success",
        message: "Password updated successfully",
      });

      // Reset form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      open?.({
        type: "error",
        message: "Password update failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.currentPassword}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPassword.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("current")}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.currentPassword && (
              <FormHelperText>{errors.currentPassword}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.newPassword}>
            <TextField
              label="New Password"
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("new")}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.newPassword && (
              <FormHelperText>{errors.newPassword}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.confirmPassword}>
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmPassword && (
              <FormHelperText>{errors.confirmPassword}</FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};