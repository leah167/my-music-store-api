const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const cleanUser = (userDocument) => {
  return {
    id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    profilePicture: userDocument.profilePicture,
    isAdmin: userDocument.isAdmin,
  };
};

const getToken = (userId) => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.AUTH_SECRET_KEY);
};

const signOut = async (req, res, next) => {
  res.clearCookie("session_token");
  res.send("Signed out successfully");
};

const userRouter = express.Router();
userRouter.get("/sign-out", (req, res, next) => {
  res.clearCookie("session_token");
  res.send("Signed out successfully");
});

// userRouter.get("/test-auth", async (req, res, next) => {
//   // check if user logged in
//   // if logged in they should have valid jwt in their cookies
//   try {
//     // if the user has not logged in, return an error
//     if (!req.user) {
//       return res.status(403).send("User not logged in");
//     }
//     res.send({ user: req.user });
//   } catch (error) {
//     next(error);
//   }
// });

//Route to create user accounts
const registerUser = async (req, res, next) => {
  // 1. We don't have a way to uniquely id users by email, username or phone number
  // 2. We are storing the user pw in our db, that is a big no no, what if they use that same pw for other sites?
  //  get credentials and user info from front end
  //  HASH (Bcrypt) the password
  //  save user info in db

  console.log("Our route is working");
  console.log("req.body: ", req.body);

  //get credentials and user info from the front end
  const { firstName, lastName, email, password, profilePicture } = req.body;

  /// HASH (Bcrypt) the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log("hashedPassword:", hashedPassword);

    // store a password hash, not the password
    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
      profilePicture,
    });

    await userDocument.save();

    const token = getToken(userDocument._id);

    res.cookie("session_token", token, {
      httpOnly: true,
      // Should be true when using https a.k.a. in prod.
      secure: false,
    });
    res.send({
      user: cleanUser(userDocument),
    });
  } catch (error) {
    // res.status(409).json({ message: "There was an error saving this user" });
    next(error);
  }
};

const signIn = async (req, res, next) => {
  // Get the credentials from req
  const { email, password } = req.body.credentials;
  try {
    //Check if that particular user exists in the db
    const foundUser = await UserModel.findOne({ email: email });
    console.log("foundUser: ", foundUser);

    // if user exists in db
    if (!foundUser) {
      return res.status(401).send("User not found or incorrect credentials");
    }

    //verify the pw matches.
    const passwordMatch = await bcrypt.compare(
      password,
      foundUser.hashedPassword
    );

    if (!passwordMatch) {
      // if pw doesnt match, send message that user credientials not valid
      return res.status(401).send("User not found or incorrect credentials");
    }

    // The user can be successfully authenticated
    // Send user data back to client

    const token = getToken(foundUser._id);

    res.cookie("session_token", token, { httpOnly: true, secure: false });
    res.send({
      user: cleanUser(foundUser),
    });
    // Provide a way for the user to not have to enter pw again in future req.
  } catch (error) {
    next(error);
  }
};

const UserService = {
  signIn,
  signOut,
  registerUser,
};

module.exports = UserService;
