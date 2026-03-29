import axios from "axios";
import React, { useState } from "react";
import registermage from "../Assets/register-image.jpg";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme, useMediaQuery } from "@mui/material";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isTabletScreen = useMediaQuery("(max-width: 1024px)");
  const isCustomScreen = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1200px)"
  );
  const isNestHubScreen = useMediaQuery(
    "(max-width: 1024px) and (max-height: 600px)"
  ); // For Nest Hub

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:12000/api/customers/register",
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }
      );
      setRegisterData({ name: "", email: "", password: "" });
      if (response?.data?.name) {
        navigate("/");
        toast.success(
          "Registered Successfully, Login with your credentials..."
        );
      }
    } catch (error) {
      toast.error("Registration failed! Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection:
          isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
            ? "column"
            : "row",
        alignItems: "center",
        justifyContent: "center",
        gap:
          isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
            ? "0"
            : "5vw",
        paddingX:
          isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
            ? "5vh 2vw"
            : "5vh",
      }}
    >
      <Box
        sx={{
          width:
            isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
              ? "100%"
              : isCustomScreen
                ? "50%"
                : "50%",
          height:
            isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
              ? "30%"
              : "80%",
          backgroundImage: `url(${registermage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>

      <Box
        elevation={3}
        sx={{
          width:
            isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
              ? "100%"
              : isCustomScreen
                ? "50%"
                : "50%",
          height:
            isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
              ? "70%"
              : "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingY:
            isSmallScreen || isMediumScreen || isTabletScreen || isNestHubScreen
              ? "5vh"
              : "10vh",
        }}
      >
        <Box
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 6,
            paddingY: "5vh",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={"bold"}
            color="primary"
            fontFamily={"inherit"}
            mb={3}
            sx={{ textDecoration: "underline" }}
          >
            Register
          </Typography>

          <TextField
            label="Name"
            type="text"
            variant="outlined"
            margin="normal"
            sx={{ width: "50%", fontFamily: "inherit" }}
            value={registerData.name}
            name="name"
            onChange={handleChange}
          />

          <TextField
            label="Email"
            type="text"
            variant="outlined"
            margin="normal"
            sx={{ width: "50%", fontFamily: "inherit" }}
            value={registerData.email}
            name="email"
            onChange={handleChange}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            sx={{ width: "50%", fontFamily: "inherit" }}
            value={registerData.password}
            name="password"
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{
              marginTop: "20px",
              paddingX: "7vh",
              fontFamily: "inherit",
              fontWeight: "bold",
            }}
          >
            Register
          </Button>

          <Typography
            sx={{ fontSize: "1.7vh", marginTop: "2vh", fontFamily: "inherit" }}
          >
            Already a user?{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                marginLeft: "0.5vw",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Register;
