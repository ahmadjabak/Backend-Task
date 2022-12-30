require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");


// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

/**
 * Application Routers
 * @type {Router}
 */
 const Students = require("./controllers/students");
 const Users=require("./controllers/users");

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project Support',
  });
});

//Students routes.
app.use("/api/students", Students);
app.use("/api/users", Users);



app.listen(process.env.PORT, () =>
  console.log(`Server Started on: http://localhost:${process.env.PORT}`)
);