const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/users");
const elections = require("./routes/election");
const app = express();
require("dotenv").config();
// const ObjectId = mongoose.Types.ObjectId;

app.use(cors());


app.use(
  express.json({ extended: true, parameterLimit: 1000000000, limit: "50000mb" })
);
app.use(bodyParser.json({ limit: "50000mb" }));
app.use(bodyParser.urlencoded({ limit: '50000mb', extended: true, parameterLimit: 50000 }));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/elections", elections);
app.use("/api/users", users);


app.get("/register", (req, res) => {
  res.send("sending mail");
});

app.get("/elections", (req, res) => {
  res.send("ElectionRoute");
});


app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/", (req, res) => {
  res.send("Welcome to election API!");
});

mongoose.set("strictQuery", false);
const url = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
