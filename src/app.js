require("dotenv").config();
//to import .env file (  )
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/UserModel");
const productRouter = require("./routes/productRouter");

const port = process.env.PORT;
// npm install express
const app = express();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => console.log("Connected to mongo db"))
  .catch(() => console.log("Unable to connect to mongo db"));

// app.options("*", cors());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());

// Parsing JSON to req.body
app.use(bodyParser.json());

// Authorization middleware
app.use(async (req, res, next) => {
  try {
    const { session_token: sessionToken } = req.cookies;

    if (!sessionToken) {
      //   res.status(403).send("user not logged in, user did not have a token");
      return next();
    }

    // This returns the data in the JWT or it throws if the JWT is not valid
    const { userId, iat } = jwt.verify(
      sessionToken,
      process.env.AUTH_SECRET_KEY
    );
    // if token is too old it will reject
    if (iat < Date.now() - 30 * 24 * 60 * 60 * 1000) {
      return res.status(401).send("Session expired");
    }

    const foundUser = await UserModel.findOne({ _id: userId });

    if (!foundUser) {
      return next();
    }
    // after we find the user in the token we add it to the request
    req.user = foundUser;

    return next();
  } catch (error) {
    next(error);
  }
});

//Express Middlewares:
// A function that runs in the middle of our request.
// That a function that runs after the server recieves a request and before the express server sends a response.

//user routes
app.use(userRouter);

//product routes
app.use(productRouter);

const errorHandler = (error, req, res, next) => {
  console.log("Error: ", error);
  res.status(500).send({ message: "There was an error, please try again." });
};
app.use(errorHandler);

// what port you want the app to "listen" to, second arg is callback function to run
app.listen(port, () =>
  console.log("Music store server is listening for request")
);
