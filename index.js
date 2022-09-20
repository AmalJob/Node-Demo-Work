const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const UserRoute = require("./Routes/Users");
const ProjectRoute = require("./Routes/Project");
const AdminRoute = require("./Routes/Admin");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(sessions);
dotenv.config();

mongoose.connect(
  process.env.MONGO_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("database connected");
  }
);

app.use(express.json());

var store = new MongoDBStore({
  uri: process.env.MONGO_CONNECT,
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware

app.use(cookieParser());
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

// router middlewares

app.use("/users", UserRoute);
app.use("/projects", ProjectRoute);
app.use("/admin", AdminRoute);

// server connect

app.listen(4000, () => {
  console.log("server connected");
});
