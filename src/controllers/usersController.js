import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = asyncErrorHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({
        success: false,
        message: "User already exists"
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
        success: true,
        message: "User created successfully"
    })
});

export const loginUser = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await user.isPasswordValid(password)) return res.status(401).json({
        success: false,
        message: "invalid email or password"
    });

    const token = user.getAuthToken();
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: token
    })
});

export const getUsers = asyncErrorHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const totalItems = await User.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const users = await User.find()
        .skip(offset)
        .limit(limit)
        .select("-password -__v -__updatedAt");
    
    res.status(200).json({
        success: true,
        data: users,
        totalPages,
        page,
        totalItems
    })
})