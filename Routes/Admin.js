const express = require("express");
const router = express.Router();
const Project = require("../ Database-Models/ProjectModel");
const dotenv = require("dotenv");
dotenv.config();
const credentials = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

console.log(credentials.email);

const verifyLogin = (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      res.status(404).json("please login");
    }
  };

router.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;


  try {
    if (email == credentials.email && pass == credentials.password) {
        req.session.admin = email;
        console.log(req.session);
      res.status(200).json("LOgged In");
    } else {
      res.status(400).json("Invalid Username or Password");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/updateProject",verifyLogin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body.id, {
      $set: req.body,
    });
    if (project) {
      res.status(200).json("Updated");
    } else {
      res.status(400).json("project not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/deleteProject",verifyLogin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.body.id);
    if (project) {
      res.status(200).json("Deleted");
    } else {
      res.status(400).json("project not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/logout", (req, res) => {
    req.session.admin = null;
  
    res.json("logged out successfully");
  });

module.exports = router;
