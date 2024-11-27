const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const JobApplicantInfo = require("./db/JobApplicant");

// MongoDB
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = 4444;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set your desired directory
  },
  filename: function (req, file, cb) {
    // Define a unique filename using timestamp
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Initialize `multer` with the storage configuration
const upload = multer({ storage });

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));
app.use("/host", express.static("public"));
app.post("/analyze", upload.single("file"), async (req, res) => {
  const { file } = req;
  const userId = req.body.userId; // Expecting the userId from request body

  if (!file || file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Invalid file format. Please upload a PDF." });
  }

  // Use the original filename
  const originalFilename = file.originalname;
  const filePath = `${resumeDir}/${originalFilename}`;

  try {
    // Write the uploaded file buffer to the filesystem
    fs.writeFileSync(filePath, file.buffer);

    // Update the profile with the resume URL
    const updatedProfile = await JobApplicantInfo.findOneAndUpdate(
      { userId },
      { resumeUrl: `/public/resume/${originalFilename}` },
      { new: true, upsert: true } // Create a new profile if not found
    );

    res.json({
      message: "Resume uploaded and linked to profile successfully",
      resumeUrl: updatedProfile.resumeUrl,
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ message: "Error while uploading resume" });
  }
});
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
