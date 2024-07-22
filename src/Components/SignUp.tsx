import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  useMediaQuery,
  Link,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the signup logic
    console.log("Signup attempt with:", { name, surname, email, password });
    // For now, let's just navigate to the dashboard
    navigate("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: isDarkMode ? "background.default" : "background.paper",
          color: isDarkMode ? "text.primary" : "text.primary",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="given-name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="surname"
                label="Surname"
                name="surname"
                autoComplete="family-name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={
              !!email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
            }
            helperText={
              email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                ? "Invalid email address"
                : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            error={!!password && password.length < 8}
            helperText={
              password && password.length < 8
                ? "Password must be at least 8 characters"
                : ""
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            error={!!confirmPassword && confirmPassword !== password}
            helperText={
              confirmPassword && confirmPassword !== password
                ? "Passwords do not match"
                : ""
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              !name ||
              !surname ||
              !email ||
              !password ||
              !confirmPassword ||
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ||
              password.length < 8 ||
              password !== confirmPassword
            }
          >
            Sign Up
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link  variant="body2" onClick={() => navigate("/auth/login")}>
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "@media (prefers-color-scheme: light)": {
              color: "rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          {"Copyright © "}
          {"MUX "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
