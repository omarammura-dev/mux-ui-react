// PasswordReset.tsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Alert } from "@mui/material";
import { styled } from "@mui/system";
import { post } from "../Service/request";

const CenteredBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  flexDirection: "column",
});

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      await post("/user/reset-password", { email });
      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CenteredBox>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">Password reset link sent!</Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CenteredBox>
    </Container>
  );
};

export default PasswordReset;
