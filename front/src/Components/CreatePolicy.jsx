import {
    Box,
    Button,
    Dialog,
    DialogActions,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { Close, CloudUpload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
    createPolicyData,
    getCustomerPolicyListData,
} from "../Redux/Slice/dataSlice";
import toast from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreatePolicy = ({ open, handleClose }) => {
    const { loginData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const policyData = ["home", "car", "health", "other"];
    const [specifyOther, setSpecifyOther] = useState("");

    // Media Queries
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:1040px)");

    // Validation Schema
    const validationSchema = Yup.object({
        contact: Yup.string()
            .required("Contact Number is required")
            .matches(/^\d+$/, "Contact number should only contain digits")
            .min(10, "Contact number should be at least 10 digits")
            .max(15, "Contact number should not exceed 15 digits"),
        option: Yup.string().required("Please select insurance type"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        image: Yup.mixed().required("Image is required"),
    });

    // Handle Image Change
    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue("image", file);
        }
    };

    // Handle Create Policy
    const handleCreatePolicy = async (values) => {
        const formData = new FormData();
        formData.append("phoneNumber", values.contact);
        formData.append("type", values.option);
        formData.append("img", values.image);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("customerId", loginData?.id);

        dispatch(createPolicyData(formData)).then((res) => {
            if (res?.payload?.message === "Policy created successfully") {
                toast.success("Policy created successfully!!");
                handleClose();
                dispatch(getCustomerPolicyListData());
            } else {
                toast.error("There was some error while creating policy.");
                handleClose();
            }
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={true}
            maxWidth="sm"
            fullWidth
        >
            <Box
                sx={{
                    padding: isMobile ? "4vh 6vw" : isTablet ? "5vh 7vw" : "6vh 8vw",
                    width: "100%",
                    height: "100%",
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
                    }}
                >
                    <Close />
                </IconButton>

                <Typography
                    fontWeight={800}
                    fontFamily="inherit"
                    mb={3}
                    sx={{
                        textAlign: "center",
                        fontSize: isMobile ? "3vh" : isTablet ? "4vh" : "4.5vh",
                        textDecoration: "underline",
                    }}
                    color="#6200ea"
                >
                    Create Policy
                </Typography>

                <Box>
                    <Typography fontWeight={750} fontSize="2.5vh">
                        Customer ID: {loginData?.id}
                    </Typography>
                    <Typography fontWeight={750} fontSize="2.5vh">
                        Customer Name: {loginData?.name?.toUpperCase()}
                    </Typography>
                    <Typography fontWeight={750} fontSize="2.5vh">
                        Customer Email: {loginData?.email}
                    </Typography>
                </Box>

                <Formik
                    initialValues={{
                        contact: "",
                        address: "",
                        city: "",
                        option: "",
                        image: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleCreatePolicy}
                >
                    {({ setFieldValue, values, touched, errors }) => (
                        <Form>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2vh",
                                    marginTop: "3vh",
                                }}
                            >
                                <Field
                                    as={TextField}
                                    label="Contact Number*"
                                    variant="outlined"
                                    type="text"
                                    name="contact"
                                    size={isMobile ? "small" : "medium"}
                                    fullWidth
                                    error={touched.contact && !!errors.contact}
                                    helperText={touched.contact && errors.contact}
                                />

                                {/* Insurance Type Selection */}
                                <Box>
                                    <label
                                        style={{
                                            fontSize: "1.8vh",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Your insurance is for?
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                        id="options"
                                        name="option"
                                        value={values.option}
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            setFieldValue("option", selectedValue);
                                            if (selectedValue === "other") {
                                                setSpecifyOther("");
                                            }
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "9px",
                                            fontSize: "16px",
                                            borderRadius: "5px",
                                            border: "1px solid #6200ea",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="">Choose an option</option>
                                        {policyData.map((item, index) => (
                                            <option value={item} key={index}>
                                                {item.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    {touched.option && errors.option && (
                                        <div style={{ color: "red", fontSize: "12px" }}>
                                            {errors.option}
                                        </div>
                                    )}
                                </Box>

                                {/* Show "Specify Other" field only when "other" is selected */}
                                {values.option === "other" && (
                                    <TextField
                                        type="text"
                                        label="Specify Other*"
                                        value={specifyOther}
                                        onChange={(e) => setSpecifyOther(e.target.value)}
                                        name="specifyOther"
                                        size="small"
                                        fullWidth
                                        sx={{ marginTop: "1vh" }}
                                    />
                                )}

                                <Field
                                    as={TextField}
                                    label="Enter Your Address*"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    name="address"
                                    error={touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                />

                                <Field
                                    as={TextField}
                                    label="City*"
                                    variant="outlined"
                                    type="text"
                                    fullWidth
                                    name="city"
                                    error={touched.city && !!errors.city}
                                    helperText={touched.city && errors.city}
                                />

                                {/* File Upload */}
                                <Box textAlign="center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="upload-button"
                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                    />
                                    <label htmlFor="upload-button">
                                        <Button component="span" variant="contained" startIcon={<CloudUpload />} fullWidth>
                                            {values.image ? values.image.name : "Upload Image*"}
                                        </Button>
                                    </label>
                                </Box>
                            </Box>

                            <DialogActions sx={{ justifyContent: "center", marginTop: "4vh" }}>
                                <Button type="submit" variant="contained">
                                    Create Policy
                                </Button>
                                <Button onClick={handleClose} variant="contained" color="error">
                                    Close
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Dialog>
    );
};

export default CreatePolicy;
