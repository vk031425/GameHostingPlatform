const express = require("express");
const User = require("../models/User");
const uploadProfilePic = require("../config/multer-config").uploadProfilePic;
const fs = require("fs");
const path = require("path");
const verifyuser = require("../middlewares/auth.js");

module.exports = () => {
  const router = express.Router();

  // GET: Get user data
  router.get("/games/:uid", async (req, res) => {
    const { uid } = req.params;
    console.log("get request is recieved by", uid );
    res.status(200).json({
        gameurl: "https://pub-2a084d30ce654c358a5f896e2b0052a3.r2.dev/web-game-export/index.html"
    })
  });

  return router;
};
