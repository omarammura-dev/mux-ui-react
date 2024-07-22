import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  useTheme,
  ThemeProvider,
  createTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import config from "../Config";
import Authentication from "../Service/Auth/Authentication";

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const isAuthenticated = Authentication.isAuthenticated();
        console.log("Authentication status:", isAuthenticated);
        if (!isAuthenticated) {
          console.log("User is not authenticated, redirecting to login");
          navigate("/auth/login");
        } else {
          console.log("User is authenticated");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/auth/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const theme = useTheme();
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
    },
  });

  const handleNavigation = (path: string) => {
    navigate(path.toLowerCase());
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 3 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              My Utility x
            </Typography>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={isOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              marginTop: "64px",
              height: "calc(100% - 64px)",
              borderRight: "none",
              boxShadow: 3,
            },
          }}
        >
          <Paper elevation={0} sx={{ height: "100%", borderRadius: 0 }}>
            <List>
              {config.drawer.items.map((text, index) => (
                <ListItem
                  button
                  key={text}
                  onClick={() => handleNavigation(text)}
                  sx={{
                    my: 1,
                    mx: 2,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      transform: "scale(1.02)",
                      transition: "all 0.2s",
                    },
                  }}
                >
                  <ListItemIcon>
                    {index === 0 ? (
                      <DashboardIcon />
                    ) : index === 1 ? (
                      <SettingsIcon />
                    ) : (
                      <HelpIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
