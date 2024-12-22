const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SchemeRouter = require("./routers/scheme");
const UserRouter = require("./routers/user");
const PostRouter = require("./routers/post");
const CommunityRouter = require("./routers/community");
const weatherAlertRegistration = require("./routers/weatherAlertRegistration");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false })); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/scheme", SchemeRouter);
app.use("/user", UserRouter);
app.use("/post", PostRouter);
app.use("/Community", CommunityRouter);
app.use("/weatherAlert", weatherAlertRegistration);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});