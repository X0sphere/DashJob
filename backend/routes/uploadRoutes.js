const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// Create necessary directories if they don't exist
const resumeDir = `${__dirname}/../public/resume`;
const profileDir = `${__dirname}/../public/profile`;
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

// Configure Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Helper function to get file extension based on mimetype
 */
function getExtensionFromMimetype(mimetype) {
  const map = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
  };
  return map[mimetype] || null;
}

// Resume upload route
router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  const fileExtension = getExtensionFromMimetype(file.mimetype);

  if (fileExtension !== ".pdf") {
    return res.status(400).json({ message: "Invalid format. Please upload a PDF." });
  }

  const filename = `${uuidv4()}${fileExtension}`;
  const filePath = `${resumeDir}/${filename}`;

  // Write the buffer directly to the file system
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ message: "Error while uploading" });
    }

    res.json({
      message: "File uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  });
});

// Profile upload route
router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  const fileExtension = getExtensionFromMimetype(file.mimetype);

  if (fileExtension !== ".jpg" && fileExtension !== ".png") {
    return res.status(400).json({ message: "Invalid format. Please upload a JPG or PNG." });
  }

  const filename = `${uuidv4()}${fileExtension}`;
  const filePath = `${profileDir}/${filename}`;

  // Write the buffer directly to the file system
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      console.error("Error writing profile image:", err);
      return res.status(500).json({ message: "Error while uploading" });
    }

    res.json({
      message: "Profile image uploaded successfully",
      url: `/host/profile/${filename}`,
    });
  });
});

module.exports = router;
