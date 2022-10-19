const express = require("express");
const UserService = require("../Services/UserService");

const userRouter = express.Router();

userRouter.get("/sign-out", UserService.signOut);

userRouter.post("/sign-in", UserService.signIn);

//Route to create user accounts
userRouter.post("/register-user", UserService.registerUser);

userRouter.post("/update-favorites", UserService.updateFavorites);

userRouter.get("/user-favorites", UserService.getUserFavorites);

module.exports = userRouter;
