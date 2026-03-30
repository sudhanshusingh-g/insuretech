const PDFDocument = require("pdfkit");
const { uploadPdfBuffer } = require("./cloudinaryService");

const generateInsuranceCertificate = async (policy, customer) => {
  try {
    const doc = new PDFDocument();
    const chunks = [];
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    doc.fontSize(22).text("Insurance Policy Certificate", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text(`Policy ID: ${policy.policyId}`);
    doc.text(`Customer: ${customer.name}`);
    doc.text(`Email: ${customer.email}`);
    doc.text(`Phone: ${customer.phoneNumber}`);
    doc.text(`Insurance Type: ${policy.type}`);
    doc.text(`Address: ${policy.address}, ${policy.city}`);
    doc.text(`Insurance Amount: Rs. ${policy.insuranceAmount}`);
    doc.text(`Policy Status: ${policy.policyStatus}`);
    doc.text(`Claim Status: ${policy.claimDetails?.status || "not claimed"}`);
    doc.text(`Payout Amount: Rs. ${policy.claimDetails?.payoutAmount || 0}`);

    if (policy.type === "home") {
      doc.moveDown(1).fontSize(14).text("Home Insurance Certificate", {
        align: "center",
      });
    } else if (policy.type === "car") {
      doc.moveDown(1).fontSize(14).text("Car Insurance Certificate", {
        align: "center",
      });
    } else if (policy.type === "health") {
      doc.moveDown(1).fontSize(14).text("Health Insurance Certificate", {
        align: "center",
      });
    } else {
      doc.moveDown(1).fontSize(14).text("General Insurance Certificate", {
        align: "center",
      });
    }

    doc.end();

    const pdfBuffer = await pdfBufferPromise;
    const uploadResult = await uploadPdfBuffer(
      pdfBuffer,
      "insurance/certificates",
      `${policy.policyId}_certificate`,
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error generating certificate:", error.message);
    throw new Error("Error generating certificate.");
  }
};

module.exports = { generateInsuranceCertificate };
