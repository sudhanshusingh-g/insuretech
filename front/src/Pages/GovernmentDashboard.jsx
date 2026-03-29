import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimRequestResponse,
  governmentAcceptAction,
  governmentRequestList,
} from "../Redux/Slice/dataSlice";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PollIcon from "@mui/icons-material/Poll";
import toast from "react-hot-toast";
import OtherPolicies from "../Components/OtherPolicies";
import GovernmentWaitingPolicies from "../Components/GovernmentWaitingPolicies";

const drawerWidth = 265;

const GovernmentDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { governmentRequestedList } = useSelector((state) => state.data);
  const [isSurveyList, setIsSurveyList] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token")


  useEffect(() => {
    dispatch(governmentRequestList());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Policies List", icon: <Dashboard /> },
    { text: "Surveyor Requests", icon: <PollIcon /> },
    { text: "Logout", icon: <Logout /> },
  ];

  const handleSidebar = (data) => {
    if (data === "Logout") {
      localStorage.clear();
      navigate("/");
    }
    if (data === "Surveyor Requests") {
      setIsSurveyList(true)
    }
    if (data === "Policies List") {
      setIsSurveyList(false)
    }
  };

  const handleGovernmentAcceptance = (data) => {
    dispatch(governmentAcceptAction(data)).then((res) => {
      if (res?.payload?.message === "Policy approved successfully" || res?.payload?.message === "Policy rejectd successfully") {
        dispatch(governmentRequestList());
        if (res?.payload?.message === "Policy approved successfully")
          toast.success("Policy approved successfully.!");
        else {
          toast.error("Policy Rejected.!")
        }
      }
    });
  };

  const handleClaimRequest = (payload) => {
    dispatch(claimRequestResponse(payload))
      .then((res) => {
        if (res?.payload?.data?.message?.includes("Claim approved successfully.")) {
          toast.success(res?.payload?.data?.message)
          dispatch(governmentRequestList());
        }
      })
  }

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

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <div
        style={{
          width: "100%",
          height: "10vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#E8E6E4",
        }}
      >
        <div style={{ fontSize: "2.5vh" }}>
          <AccountCircleIcon />
        </div>
        <div style={{ color: "maroon", fontWeight: "bold" }}>Admin</div>
      </div>
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
            Admin Dashboard
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
            height: "85vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "2rem", md: "2rem" }, // Adjusting font size for different screens
            }}
          >
            {isSurveyList ? "Surveyor Requests" : "Policy List"}
          </Typography>
          <Box
            sx={{
              width: "100%",
            }}
          >
            {!isSurveyList ?
              <OtherPolicies governmentRequestedList={governmentRequestedList} handleGovernmentAcceptance={handleGovernmentAcceptance} />
              :
              <GovernmentWaitingPolicies governmentRequestedList={governmentRequestedList} handleClaimRequest={handleClaimRequest} />
            }
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GovernmentDashboard;