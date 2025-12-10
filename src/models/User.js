import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["farmer", "admin", "buyer"],
    required: true,
    default: "buyer",
  },
}, {timestamps: true});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.isPasswordValid = async function (body_password) {
  return await bcrypt.compare(body_password, this.password);
};

userSchema.methods.getAuthToken = function () {
  return jwt.sign(
    {
      id: this._id.toString(),
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

export { User };
