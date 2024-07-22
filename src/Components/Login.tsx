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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Authentication from "../Service/Auth/Authentication";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Authentication.login(email, password)
      .then((isSuccess) => {
        if (isSuccess) {
          navigate("/");
        } else {
          console.error("Login failed");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
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
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            error={!!password && password.length < 8}
            helperText={
              password && password.length < 8
                ? "Password must be at least 8 characters"
                : ""
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              !email ||
              !password ||
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ||
              password.length < 8
            }
          >
            Sign In
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Link variant="body2" onClick={() => navigate("/auth/signup")}>
              {"Don't have an account? Sign Up"}
            </Link>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
        {/* <Divider sx={{ width: '100%', mt: 3, mb: 2 }} /> */}
        {/* <Typography variant="body2" color="text.secondary" align="center">
          Or sign in with
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={() => console.log('Google sign-in')}>
            Google
          </Button>
          <Button variant="outlined" onClick={() => console.log('Facebook sign-in')}>
            Facebook
          </Button>
        </Box> */}
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

export default Login;
