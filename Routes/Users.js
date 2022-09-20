const User = require("../ Database-Models/UserModal");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const sessions = require("express-session");

const verifyLogin = (req, res, next) => {
  if (req.session.userid) {
    next();
  } else {
    res.json("please login");
  }
};

router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashpassword,
      phone: req.body.phone,
    });

    const user = await newUser.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  var session;
  if (user && bcrypt.compare(req.body.password, user.password)) {
    session = req.session;
    session.userid = req.body.email;
    console.log(req.session);
    res.status(200).json(user);
  } else {
    res.status(400).json("Invalid email or password");
  }
});

router.get("/users", verifyLogin, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $nin: req.body.userId } },
      { _id: 0, useamrne: 1, email: 1, phone: 1 }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/updateProfile", verifyLogin, async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true }
    );
    res.status(200).json("updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.userid = null;

  res.json("logged out successfully");
});

module.exports = router;
