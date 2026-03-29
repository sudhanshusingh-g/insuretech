import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu, Dashboard, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSurveyorPolicyList } from "../Redux/Slice/dataSlice";
import ViewPolicyDetails from "../Components/ViewPolicyDetails";
import SurveyorRequestList from "../Components/SurveyorRequestList";

const drawerWidth = 265;

const SurveyorDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState(false);
  const [viewPolicy, setViewPolicy] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token")

  const { surveyorList } = useSelector((state) => state.data);
  useEffect(() => {
    dispatch(getSurveyorPolicyList());
  }, [dispatch]);

  useEffect(() => {
    if (!token || token == "undefined") {
      navigate("/")
    } else if (token) {
      const user = localStorage.getItem("user")
      if (user == "customer") {
        navigate("/customer-dashboard")
      } else if (user == "surveyor") {
        navigate("/surveyor-dashboard")
      } else if (user == "government") {
        navigate("/government-dashboard")
      }
    }
  }, [token])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebar = (data) => {
    if (data === "Logout") {
      localStorage.clear();
      navigate("/");
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard /> },
    { text: "Logout", icon: <Logout /> },
  ];

  const handleViewClose = () => {
    setView(false);
  };

  const handleViewPolicy = (policy) => {
    setViewPolicy(policy);
    setView(true);
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton onClick={() => handleSidebar(item?.text)}>
              <ListItemIcon
                sx={{ color: item.text === "Logout" ? "maroon" : "" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      color: item.text === "Logout" ? "maroon" : "",
                      fontWeight: "bold",
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap fontWeight={"800"}>
            Surveyor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          display: { xs: "none", md: "block" },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Your Policies
          </Typography>
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <SurveyorRequestList handleViewPolicy={handleViewPolicy} surveyorList={surveyorList} />
          </Box>
        </Box>
        <ViewPolicyDetails
          open={view}
          handleClose={handleViewClose}
          viewPolicy={viewPolicy}
        />
      </Box>
    </Box>
  );
};

export default SurveyorDashboard;
