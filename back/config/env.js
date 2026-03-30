const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const loadEnvFile = (filename, override = false) => {
  const filePath = path.join(__dirname, "..", filename);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override });
  }
};

const envName = process.env.NODE_ENV || "development";

loadEnvFile(`.env.${envName}`);
loadEnvFile(".env");

module.exports = {
  envName,
};
