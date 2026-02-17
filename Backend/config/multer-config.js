const multer = require("multer");

// store files in memory as Buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = {
  uploadProfilePic: upload.single("profilePic"), // field name stays the same
};
