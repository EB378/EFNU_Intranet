"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useLogin, useRegister } from "@refinedev/core";
import { TextField, Box, Button, Typography, Link, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "@components/GoogleAuthButton";

type AuthPageProps = {
  type: "login" | "register";
};

export const AuthPage = ({ type }: AuthPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = useLogin();
  const registerUser = useRegister();
  const router = useRouter();

  const onSubmit = async (values: any) => {
    if (type === "register") {
      await registerUser.mutateAsync({
        email: values.email,
        password: values.password,
        user_metadata: {
          fullname: values.fullname,
          phone: values.phone,
          license: values.license,
        },
      });
    } else {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", mt: 8 }}
    >
      <Typography variant="h5" gutterBottom>
        {type === "register" ? "Register" : "Login"}
      </Typography>

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message as string}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        {...register("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message as string}
      />

      {type === "register" && (
        <>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            {...register("fullname", { required: "Full name is required" })}
            error={!!errors.fullname}
            helperText={errors.fullname?.message as string}
          />

          <TextField
            fullWidth
            label="Phone"
            margin="normal"
            {...register("phone")}
          />

          <TextField
            fullWidth
            label="License"
            margin="normal"
            {...register("license")}
          />
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2 }}
      >
        {type === "register" ? "Sign Up" : "Login"}
      </Button>

      <Divider sx={{ my: 3 }}>or</Divider>

      <GoogleAuthButton />

      <Box mt={2} textAlign="center">
        {type === "register" ? (
          <Link
            component="button"
            onClick={() => router.push("/login")}
            underline="hover"
          >
            Already have an account? Login
          </Link>
        ) : (
          <Link
            component="button"
            onClick={() => router.push("/register")}
            underline="hover"
          >
            Don&apos;t have an account? Register
          </Link>
        )}
      </Box>
    </Box>
  );
};
