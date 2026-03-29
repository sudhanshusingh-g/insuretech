const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInsuranceCertificate = async (policy, customer) => {
  try {
    const certificatesDir = path.join(__dirname, "../certificates");
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir);
    }

    const certificateFileName = `${policy.policyId}_certificate.pdf`;
    const certificatePath = path.join(certificatesDir, certificateFileName);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(certificatePath);
    doc.pipe(writeStream);

    doc.fontSize(22).text("Insurance Policy Certificate", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text(`Policy ID: ${policy.policyId}`);
    doc.text(`Customer: ${customer.name}`);
    doc.text(`Email: ${customer.email}`);
    doc.text(`Phone: ${customer.phoneNumber}`);
    doc.text(`Insurance Type: ${policy.type}`);
    doc.text(`Address: ${policy.address}, ${policy.city}`);
    doc.text(`Insurance Amount: ₹${policy.insuranceAmount}`);
    doc.text(`Policy Status: ${policy.policyStatus}`);
    doc.text(`Claim Status: ${policy.claimDetails.status}`);
    doc.text(`Payout Amount: ₹${policy.claimDetails.payoutAmount}`);

    if (policy.type === "home") {
      doc
        .moveDown(1)
        .fontSize(14)
        .text("🏠 Home Insurance Certificate", { align: "center" });
    } else if (policy.type === "car") {
      doc
        .moveDown(1)
        .fontSize(14)
        .text("🚗 Car Insurance Certificate", { align: "center" });
    } else if (policy.type === "health") {
      doc
        .moveDown(1)
        .fontSize(14)
        .text("🏥 Health Insurance Certificate", { align: "center" });
    } else {
      doc
        .moveDown(1)
        .fontSize(14)
        .text("🔹 General Insurance Certificate", { align: "center" });
    }

    doc.end();

    return `/certificates/${certificateFileName}`;
  } catch (error) {
    console.error("Error generating certificate:", error.message);
    throw new Error("Error generating certificate.");
  }
};

module.exports = { generateInsuranceCertificate };
