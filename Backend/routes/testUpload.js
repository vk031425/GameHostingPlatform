const express = require("express");
const router = express.Router();
const r2 = require("../config/r2");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

router.get("/test-upload-url", async (req, res) => {
  try {
    const fileKey = `test-folder/test-file.zip`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileKey,
      ContentType: "application/zip",
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 300, // 5 minutes
    });

    res.json({ uploadUrl, fileKey });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

module.exports = router;