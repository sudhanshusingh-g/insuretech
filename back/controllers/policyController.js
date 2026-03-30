const PolicyModel = require("../models/policyModel");
const mongoose = require("mongoose");
const CustomerModel = require("../models/customerModel");
const FormData = require("form-data");
const axios = require("axios");
const ML_API = process.env.ML_API_URL;
const ML_TIMEOUT_MS = 120000;
const {
  generateInsuranceCertificate,
} = require("../services/certificateGenerators");
const NotificationModel = require("../models/NotificationModel");
const { uploadImageFile } = require("../services/cloudinaryService");

const insuranceAmounts = {
  home: 500000,
  car: 300000,
  health: 200000,
  other: 400000,
};

const getCustomerPolicies = async (req, res) => {
  try {
    const customerPolicies = await PolicyModel.find({
      customerId: req.user.id,
    });

    return res.status(200).json({
      message: "Policies fetched successfully",
      policies: customerPolicies.map((policy) => ({
        ...policy.toObject(),
        createdAt: policy.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error in getCustomerPolicies:", err.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

const getAllPolicies = async (req, res) => {
  try {
    let policies = [];

    if (req.user.role === "government") {
      policies = await PolicyModel.find();
    } else if (req.user.role === "surveyor" || req.user.role === "customer") {
      policies = await PolicyModel.find({ userId: req.user.id });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const waitingForGovernmentPolicies = policies.filter(
      (policy) => policy.policyStatus === "waiting for government",
    );
    const otherPolicies = policies.filter(
      (policy) => policy.policyStatus !== "waiting for government",
    );

    return res.status(200).json({
      message: "Policies fetched successfully",
      waitingForGovernmentPolicies,
      otherPolicies,
    });
  } catch (err) {
    console.error("Error in getAllPolicies:", err);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

const createPolicy = async (req, res) => {
  try {
    const { phoneNumber, type, address, city, customerId } = req.body;

    if (
      !phoneNumber ||
      !type ||
      !req.file ||
      !address ||
      !city ||
      !customerId
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const normalizedType = type.toLowerCase();
    if (!insuranceAmounts[normalizedType]) {
      return res.status(400).json({
        message: "Invalid policy type. Allowed types: home, car, health",
      });
    }

    const uploadedBeforeDamageImage = await uploadImageFile(
      req.file,
      "insurance/policies/before-damage",
      `${customerId}-${Date.now()}-${normalizedType}`,
    );

    const newPolicy = new PolicyModel({
      customerId,
      phoneNumber,
      type: normalizedType,
      address,
      city,
      beforeDamageImage: uploadedBeforeDamageImage.secure_url,
      policyId: new mongoose.Types.ObjectId().toHexString(),
      policyStatus: "pending",
      insuranceAmount: insuranceAmounts[normalizedType],
    });

    await newPolicy.save();

    const createdAtDate = newPolicy.createdAt.toISOString().split("T")[0];

    return res.status(201).json({
      message: "Policy created successfully",
      customer: await CustomerModel.findById(customerId).select(
        "name email phoneNumber",
      ),
      policy: {
        policyId: newPolicy.policyId,
        type: newPolicy.type,
        address: newPolicy.address,
        city: newPolicy.city,
        insuranceAmount: newPolicy.insuranceAmount,
        policyStatus: newPolicy.policyStatus,
        createdAt: createdAtDate,
        beforeDamageImage: newPolicy.beforeDamageImage,
      },
    });
  } catch (err) {
    console.error("Error in createPolicy:", err.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

const approveRejectPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { action } = req.body;

    if (!policyId || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    const policy = await PolicyModel.findOne({ policyId }).populate(
      "customerId",
      "name email phoneNumber",
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    policy.policyStatus = action === "approve" ? "active" : "rejected";
    await policy.save();

    const createdAtDate = policy.createdAt.toISOString().split("T")[0];

    return res.status(200).json({
      message: `Policy ${action}d successfully`,
      customer: policy.customerId,
      policy: {
        policyId: policy.policyId,
        type: policy.type,
        address: policy.address,
        city: policy.city,
        insuranceAmount: policy.insuranceAmount,
        policyStatus: policy.policyStatus,
        createdAt: createdAtDate,
        beforeDamageImage: policy.beforeDamageImage,
      },
    });
  } catch (err) {
    console.error("Error in approveRejectPolicy:", err.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

const claimPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { damageDescription } = req.body;

    if (!damageDescription || !req.file) {
      return res
        .status(400)
        .json({ message: "Damage description and image are required." });
    }

    const policy = await PolicyModel.findOne({ policyId }).populate(
      "customerId",
      "name email phoneNumber",
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    const uploadedDamageImage = await uploadImageFile(
      req.file,
      "insurance/policies/damage-claims",
      `${policyId}-${Date.now()}-damage`,
    );

    const claimId = new mongoose.Types.ObjectId().toHexString();
    const claimDate = new Date().toISOString().split("T")[0];

    policy.claimDetails = {
      claimId,
      damageDescription,
      damageImage: uploadedDamageImage.secure_url,
      status: "pending",
      date: claimDate,
    };

    policy.policyStatus = "under review";
    await policy.save();

    const createdAtDate = policy.createdAt.toISOString().split("T")[0];

    return res.status(201).json({
      message: "Claim request submitted successfully. Surveyor will review it.",
      customer: policy.customerId,
      policy: {
        policyId: policy.policyId,
        type: policy.type,
        address: policy.address,
        city: policy.city,
        insuranceAmount: policy.insuranceAmount,
        policyStatus: policy.policyStatus,
        createdAt: createdAtDate,
        beforeDamageImage: policy.beforeDamageImage,
      },
      claim: {
        claimId,
        damageDescription,
        damageImage: uploadedDamageImage.secure_url,
        status: "pending",
        date: claimDate,
      },
    });
  } catch (err) {
    console.error("Error in claimPolicy:", err.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

const getCertificate = async (req, res) => {
  try {
    const { policyId } = req.params;

    if (!policyId) {
      return res.status(400).json({ message: "Policy ID is required." });
    }

    const policy = await PolicyModel.findOne({ policyId }).populate(
      "customerId",
      "name email phoneNumber",
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    if (
      policy.policyStatus !== "active" &&
      policy.policyStatus !== "approved" &&
      policy.policyStatus !== "fulfilled"
    ) {
      return res.status(400).json({
        message: "Policy is not active, approved, or fulfilled yet.",
      });
    }

    const certificateUrl = await generateInsuranceCertificate(
      policy,
      policy.customerId,
    );

    return res.status(200).json({
      message: "Certificate generated successfully.",
      certificateUrl,
    });
  } catch (err) {
    console.error("Error in getCertificate:", err);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

const reviewClaimBySurveyor = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { assessment, surveyorComments } = req.body;

    const policy = await PolicyModel.findOne({ policyId }).populate(
      "customerId",
      "name email phoneNumber",
    );

    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    if (policy.policyStatus !== "under review") {
      return res
        .status(400)
        .json({ message: "Claim must be under review first." });
    }

    if (!policy.beforeDamageImage || !policy.claimDetails?.damageImage) {
      return res.status(400).json({
        message: "Both policy and claim images are required for review.",
      });
    }

    const [originalImageResponse, damageImageResponse] = await Promise.all([
      axios.get(policy.beforeDamageImage, { responseType: "arraybuffer" }),
      axios.get(policy.claimDetails.damageImage, { responseType: "arraybuffer" }),
    ]);

    const originalImageBuffer = Buffer.from(originalImageResponse.data);
    const damageImageBuffer = Buffer.from(damageImageResponse.data);

    const formData = new FormData();
    formData.append("image1", originalImageBuffer, {
      filename: "before-damage.jpg",
      contentType: originalImageResponse.headers["content-type"] || "image/jpeg",
    });
    formData.append("image2", damageImageBuffer, {
      filename: "damage-image.jpg",
      contentType: damageImageResponse.headers["content-type"] || "image/jpeg",
    });

    try {
      const compareResponse = await axios.post(
        `${ML_API}/compare-images`,
        formData,
        {
          headers: { ...formData.getHeaders() },
          timeout: ML_TIMEOUT_MS,
        },
      );

      const { damagePercentage } = compareResponse.data;

      const predictFormData = new FormData();
      predictFormData.append("image", damageImageBuffer, {
        filename: "damage-image.jpg",
        contentType: damageImageResponse.headers["content-type"] || "image/jpeg",
      });

      const predictResponse = await axios.post(
        `${ML_API}/predict-damage`,
        predictFormData,
        {
          headers: { ...predictFormData.getHeaders() },
          timeout: ML_TIMEOUT_MS,
        },
      );

      const { damageScore } = predictResponse.data;

      policy.surveyorReport = {
        assessment,
        surveyorComments,
        status: "pending",
        damagePercentage,
        damageScore,
      };

      policy.policyStatus = "waiting for government";
      await policy.save();

      return res.status(200).json({
        message: "Surveyor review submitted. Awaiting government approval.",
        customer: {
          name: policy.customerId.name,
          email: policy.customerId.email,
          phoneNumber: policy.customerId.phoneNumber,
        },
        policy: {
          policyId: policy.policyId,
          type: policy.type,
          address: policy.address,
          city: policy.city,
          insuranceAmount: policy.insuranceAmount,
          policyStatus: policy.policyStatus,
          createdAt: policy.createdAt?.toISOString().split("T")[0],
          beforeDamageImage: policy.beforeDamageImage,
        },
        claimDetails: {
          claimId: policy.claimDetails.claimId,
          damageDescription: policy.claimDetails.damageDescription,
          damageImage: policy.claimDetails.damageImage,
          status: policy.claimDetails.status,
        },
        surveyorReport: {
          assessment: policy.surveyorReport.assessment,
          surveyorComments: policy.surveyorReport.surveyorComments,
          damagePercentage: policy.surveyorReport.damagePercentage,
          damageScore: policy.surveyorReport.damageScore,
        },
      });
    } catch (err) {
      console.error("Error sending images to Flask:", err.message);
      return res.status(502).json({
        message: "ML service request failed.",
        error: err.message,
        mlApiUrl: ML_API,
      });
    }
  } catch (err) {
    console.error("Server Error in reviewClaimBySurveyor:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const getAllClaimPolicy = async (req, res) => {
  try {
    const claimedPolicies = await PolicyModel.find({
      "claimDetails.claimId": { $exists: true },
    });

    if (!claimedPolicies || claimedPolicies.length === 0) {
      return res.status(404).json({ message: "No claimed policies found." });
    }

    return res.status(200).json(claimedPolicies);
  } catch (error) {
    console.error("Error fetching claimed policies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveRejectClaimByGovernment = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { action } = req.body;

    if (!mongoose.isValidObjectId(claimId)) {
      return res.status(400).json({ message: "Invalid claim ID format." });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    const policy = await PolicyModel.findOne({
      "claimDetails.claimId": claimId,
    }).populate("customerId", "name email phoneNumber");

    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    if (policy.policyStatus !== "waiting for government") {
      return res
        .status(400)
        .json({ message: "Claim must be reviewed by a surveyor first." });
    }

    const damagePercentage = policy.surveyorReport?.damagePercentage;
    if (damagePercentage == null) {
      return res
        .status(400)
        .json({ message: "Damage percentage not found in surveyor report." });
    }

    const payoutAmount = Math.round(
      (damagePercentage / 100) * policy.insuranceAmount,
    );

    policy.claimDetails.status = action === "approve" ? "approved" : "rejected";
    policy.claimDetails.payoutAmount = action === "approve" ? payoutAmount : 0;
    policy.policyStatus = action === "approve" ? "fulfilled" : "rejected";
    policy.payoutAmount = action === "approve" ? payoutAmount : 0;

    await policy.save();

    let certificatePath = "";
    if (action === "approve") {
      certificatePath = await generateInsuranceCertificate(
        policy,
        policy.customerId,
      );

      await NotificationModel.create({
        customerId: policy.customerId._id,
        policyId: policy._id,
        claimId,
        policyStatus: policy.policyStatus,
        payoutAmount: policy.payoutAmount,
        message: `Your insurance claim for ${policy.type} has been approved. Certificate available for download.`,
        certificatePath,
      });
    }

    return res.status(200).json({
      message: `Claim ${action}d successfully. Certificate sent to ${policy.customerId.name}.`,
      customer: {
        customerId: policy.customerId._id,
        name: policy.customerId.name,
        email: policy.customerId.email,
        phoneNumber: policy.customerId.phoneNumber,
      },
      policy: {
        policyId: policy.policyId,
        type: policy.type,
        address: policy.address,
        city: policy.city,
        insuranceAmount: policy.insuranceAmount,
        policyStatus: policy.policyStatus,
        payoutAmount: policy.payoutAmount,
      },
      claimDetails: {
        claimId: policy.claimDetails.claimId,
        damageDescription: policy.claimDetails.damageDescription,
        damageImage: policy.claimDetails.damageImage,
        status: policy.claimDetails.status,
        payoutAmount: policy.claimDetails.payoutAmount,
      },
      certificatePath: action === "approve" ? certificatePath : null,
    });
  } catch (err) {
    console.error("Error in approveRejectClaimByGovernment:", err.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

const getCustomerNotifications = async (req, res) => {
  try {
    const customerId = req.user.id;

    const notifications = await NotificationModel.find({ customerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

module.exports = {
  getAllPolicies,
  createPolicy,
  approveRejectPolicy,
  claimPolicy,
  getCertificate,
  approveRejectClaimByGovernment,
  reviewClaimBySurveyor,
  getCustomerPolicies,
  getAllClaimPolicy,
  getCustomerNotifications,
};
