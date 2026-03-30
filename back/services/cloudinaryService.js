const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = ({
  buffer,
  folder,
  resourceType = "image",
  publicId,
  format,
}) =>
  new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
      public_id: publicId,
      overwrite: true,
      invalidate: true,
    };

    if (format) {
      options.format = format;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

const sanitizePublicId = (value) =>
  String(value)
    .trim()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "_");

const uploadImageFile = async (file, folder, publicId) => {
  if (!file?.buffer) {
    throw new Error("Upload file buffer is missing.");
  }

  const originalName = path.parse(file.originalname || "file").name;
  const safePublicId =
    publicId || `${Date.now()}-${sanitizePublicId(originalName)}`;

  return uploadBufferToCloudinary({
    buffer: file.buffer,
    folder,
    resourceType: "image",
    publicId: safePublicId,
  });
};

const uploadPdfBuffer = async (buffer, folder, publicId) => {
  if (!buffer) {
    throw new Error("Certificate buffer is missing.");
  }

  return uploadBufferToCloudinary({
    buffer,
    folder,
    resourceType: "raw",
    publicId: sanitizePublicId(publicId),
    format: "pdf",
  });
};

module.exports = {
  sanitizePublicId,
  uploadImageFile,
  uploadPdfBuffer,
};
