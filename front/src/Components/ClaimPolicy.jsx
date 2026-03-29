import { Close, CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimCustomerPolicy,
  getCustomerPolicyListData,
} from "../Redux/Slice/dataSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const ClaimPolicy = ({ open, handleClose, policyData }) => {
  const { loginData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imageName, setImageName] = useState("Upload Damage Image*");

  const isMobile = useMediaQuery("(max-width:600px)");

  const formik = useFormik({
    initialValues: {
      description: "",
      image: null,
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
      image: Yup.mixed().required("Damage image is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("damageDescription", values.description);
      formData.append("damageImage", values.image);

      const damageData = {
        formData: formData,
        id: policyData?.policyId,
      };

      dispatch(claimCustomerPolicy(damageData)).then((res) => {
        if (
          res?.payload?.message ===
          "Claim request submitted successfully. Surveyor will review it."
        ) {
          toast.success("Claim requested successfully");
          dispatch(getCustomerPolicyListData());
          handleClose();
          formik.resetForm();
          setImageName("Upload Damage Image*");
        }
      });
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImageName(file.name);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      maxWidth="md"
      fullWidth
    >
      <div
        style={{
          padding: isMobile ? "5vh" : "3vh",
          height: "100vh",
          width: "100vw",
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#6200ea",
            "&:hover": { color: "#4500b5" },
          }}
        >
          <Close />
        </IconButton>

        <Typography
          fontWeight={"800"}
          fontFamily={"inherit"}
          mb={3}
          sx={{
            textDecoration: "underline",
            textAlign: "center",
            fontSize: isMobile ? "5vh" : "3.5vh",
          }}
          color="#6200ea"
        >
          Claim Policy
        </Typography>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            lineHeight: "0.3vh",
          }}
        >
          <Typography
            sx={{ fontWeight: "750", fontSize: isMobile ? "3vh" : "2.5vh" }}
          >
            Customer ID: {loginData?.id}
          </Typography>
          <Typography
            sx={{ fontWeight: "750", fontSize: isMobile ? "3vh" : "2.5vh" }}
          >
            Customer Name: {loginData?.name?.toUpperCase()}
          </Typography>
          <Typography
            sx={{ fontWeight: "750", fontSize: isMobile ? "3vh" : "2.5vh" }}
          >
            Customer Email: {loginData?.email}
          </Typography>
        </div>

        <Box sx={{ width: "100%" }}>
          <TextField
            label="Enter description*"
            variant="outlined"
            multiline
            rows={isMobile ? 4 : 2}
            fullWidth
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            placeholder="Enter description..."
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              marginTop: "2vh",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#6200ea" },
                "&:hover fieldset": { borderColor: "#4500b5" },
                "&.Mui-focused fieldset": { borderColor: "#3700b3" },
              },
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", marginTop: "2vh" }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-button"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-button">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUpload />}
              sx={{
                backgroundColor: "#6200ea",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                padding: isMobile ? "8px 30px" : "10px 57px",
                borderRadius: "8px",
                height: "5.4vh",
                "&:hover": { backgroundColor: "#4500b5" },
              }}
            >
              {imageName.length > 20
                ? `${imageName.substring(0, 17)}...`
                : imageName}
            </Button>
          </label>
          {formik.touched.image && formik.errors.image && (
            <Typography color="error" sx={{ mt: 1 }}>
              {formik.errors.image}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            marginTop: "5vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vh",
          }}
        >
          <Button
            component="span"
            variant="contained"
            sx={{
              backgroundColor: formik.isValid ? "#C01B0F" : "grey",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 57px",
              borderRadius: "8px",
              height: "5.4vh",
              "&:hover": {
                backgroundColor: formik.isValid ? "#4500b5" : "grey",
              },
            }}
            disabled={!formik.isValid}
            onClick={formik.handleSubmit}
          >
            Claim Policy
          </Button>
        </Box>
      </div>
    </Dialog>
  );
};

export default ClaimPolicy;
