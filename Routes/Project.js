const express = require("express");
const router = require("express").Router();
const Project = require("../ Database-Models/ProjectModel");

const verifyLogin = (req, res, next) => {
  if (req.session.userid) {
    next();
  } else {
    res.status(404).json("please login");
  }
};

router.post("/addProject", verifyLogin, async (req, res) => {
  try {
    const newProject = new Project({
      userId: req.body.userId,
      ProjectName: req.body.ProjectName,
      StartDate: req.body.StartDate,
      EstimatedHours: req.body.EstimatedHours,
      Tools: req.body.Tools,
      Methodology: req.body.Methodology,
      Developers: req.body.Developers,
      MobileApp: req.body.MobileApp,
    });

    const project = await newProject.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/updateProject", async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { $and: [{ _id: req.body.id }, { userId: req.body.userId }] },
      {
        $set: req.body,
      }
    );
    if (project) {
      res.status(200).json("Updated");
    } else {
      res.status(400).json("project not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/deleteProject", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      $and: [{ _id: req.body.id }, { userId: req.body.userId }],
    });
    if (project) {
      res.status(200).json("Deleted");
    } else {
      res.status(400).json("project not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/allProjects", verifyLogin, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
