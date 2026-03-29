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
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import ClaimPolicy from "../Components/ClaimPolicy";
import { useDispatch, useSelector } from "react-redux";
import { fulfilledPoliciedData, getCustomerPolicyListData } from "../Redux/Slice/dataSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreatePolicy from "../Components/CreatePolicy";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CustomerPendingPolicies from "../Components/CustomerPendingPolicies";
import CustomerFulfilledPolicies from "../Components/CustomerFulfilledPolicies";

const drawerWidth = 265;

const CustomerDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [createPolicyPopup, setCreatePolicyPopup] = useState(false);
    const [claimPolicyPopup, setClaimPolicyPopup] = useState(false);
    const [policyData, setPolicyData] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customerPolicyList, customerFulfilledPolicies } = useSelector((state) => state.data);
    const { loginData } = useSelector((state) => state.auth);
    const [isFulfilledPolicy, setIsFulfilledPolicy] = useState(false)
    const token = localStorage.getItem("token")

    useEffect(() => {
        dispatch(getCustomerPolicyListData());
        dispatch(fulfilledPoliciedData())
    }, []);

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
        if (data == "Create New Policy") {
            setCreatePolicyPopup(true);
        } else if (data == "Logout") {
            localStorage.clear();
            navigate("/");
        }
        else if (data == "Fulfilled Policies") {
            setIsFulfilledPolicy(true)
        } else {
            setIsFulfilledPolicy(false)
        }
    };

    const handleClose = () => {
        setCreatePolicyPopup(false);
    };

    const handleClaimPolicyOpen = (data) => {
        setPolicyData(data);
        setClaimPolicyPopup(true);
    };

    const handleClaimPolicyClose = () => {
        setClaimPolicyPopup(false);
    };

    const menuItems = [
        { text: "Current Policies", icon: <Dashboard /> },
        { text: "Create New Policy", icon: <AddBoxIcon /> },
        { text: "Fulfilled Policies", icon: <LibraryAddCheckIcon /> },
        { text: "Logout", icon: <Logout /> },
    ];

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <div
                style={{
                    width: "100%",
                    height: "14vh",
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
                <div style={{ color: "maroon", fontWeight: "bold" }}>
                    {loginData?.name}
                </div>
                <div style={{ fontSize: "2vh", fontWeight: "bold" }}>
                    {loginData?.email}
                </div>
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
                        Customer Dashboard
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
                {customerPolicyList?.length === 0 ? (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p
                            style={{
                                backgroundColor: "#CCE8EF",
                                paddingInline: "2vw",
                                paddingBlock: "2vh",
                                fontSize: "2.5vh",
                                fontWeight: "bold",
                                border: "2px solid #2EB0D1",
                                borderRadius: "5vh",
                            }}
                        >
                            No policies created yet
                        </p>
                        <Button
                            variant="contained"
                            onClick={() => handleSidebar("Create New Policy")}
                        >
                            Create Policy
                        </Button>
                    </div>
                ) : (
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
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                            {isFulfilledPolicy ? "Fulfilled Policies" : "Current Policies"}
                        </Typography>
                        <Box
                            sx={{
                                width: "90%",
                            }}
                        >
                            {!isFulfilledPolicy ?
                                <CustomerPendingPolicies handleClaimPolicyOpen={handleClaimPolicyOpen} customerPolicyList={customerPolicyList} />
                                :
                                <CustomerFulfilledPolicies customerFulfilledPolicies={customerFulfilledPolicies} />
                            }
                        </Box>
                    </Box>
                )}
            </Box>
            <CreatePolicy open={createPolicyPopup} handleClose={handleClose} />
            <ClaimPolicy
                open={claimPolicyPopup}
                handleClose={handleClaimPolicyClose}
                policyData={policyData}
            />
        </Box>
    );
};

export default CustomerDashboard;
