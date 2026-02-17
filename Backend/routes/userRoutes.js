const express = require("express");
const User = require("../models/User");
const uploadProfilePic = require("../config/multer-config").uploadProfilePic;
const fs = require("fs");
const path = require("path");
const verifyuser = require("../middlewares/auth.js");

module.exports = () => {
  const router = express.Router();

  // GET: Get user data
  router.get("/user/:uid/:username", verifyuser, async (req, res) => {
    const { username } = req.params;
    console.log("get request is recieved by", username );
    res.send(200);
  });

  // POST: Update user
  router.post("/user/update", verifyuser, async (req, res) => {
    const { username } = req.body;
    console.log("update request is received by",username);
    res.send(200);
  });

  // DELETE: Delete user data
  router.delete("/user/:username", verifyuser, async (req, res) => {
    const { username } = req.params;
    console.log("delete request is received by", username);
    res.send(200);
  });

  return router;
};
