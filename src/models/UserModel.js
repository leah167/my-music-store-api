const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // trim removes unnescesary spaces
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  hashedPassword: { type: String, required: true },
  profilePicture: { type: String, required: true, trim: true },
  isAdmin: { type: Boolean, required: true, default: false },
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", unique: true },
  ],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
