import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import asyncHandler from "../middlewares/asyncHandler.js";

import User from "../models/userModel.js";

import { generateToken, generateAuthToken } from "../utils/generateToken.js";
import mailerGmail from "../utils/mailerGmail.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(`${password}`, `${user.password}`))) {
        generateToken(res, user._id);
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        await mailerGmail({
            from: process.env.EMAIL_ID,
            to: email,
            subject: "OTP",
            text: `Your OTP is ${otp}`,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to send OTP");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(`${otp}`, salt);

        const payload = { email, name, password, hashedOtp, attempts: 1 };

        const token = generateAuthToken(res, payload);

        return res.status(200).json({
            message: "OTP sent successfully",
            data: {},
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to register user, please try again");
    }
});

const verifyOtpAndRegister = asyncHandler(async (req, res) => {
    const { otp } = req.body;

    const token = req.cookies.jwt;

    if (!token) {
        res.status(401);
        throw new Error("Verification session expired. Please start registration again");
    }

    if (!otp) {
        res.status(400);
        throw new Error("OTP is required");
    }

    if (otp.length !== 6 || (parseInt(otp) < 100000 || parseInt(otp) > 999999)) {
        res.status(400);
        throw new Error("Please enter a valid OTP");
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "auth") {
        return res.status(401).json({ message: "Invalid verification token" });
    }

    if (Date.now() > new Date(decoded.exp * 1000)) {
        res.clearCookie("jwt");
        res.status(400)
        throw new Error("Verification session expired. Please start registration again.");
    }

    if (Number(decoded.attempts) >= 3) {
        res.clearCookie("jwt");
        res.status(400)
        throw new Error("Maximum OTP attempts exceeded. Please try again later");
    }

    const isOTPValid = await bcrypt.compare(`${otp}`, `${decoded.hashedOtp}`);;
    if (!isOTPValid) {
        const { exp, iat, ...rest } = decoded;
        decoded = { ...rest, attempts: decoded.attempts + 1 };
        generateAuthToken(res, decoded);

        return res.status(400).json({
            message: "Invalid OTP",
            attemptsLeft: 4 - decoded.attempts
        });
    }

    const newUser = new User({
        name: decoded.name,
        email: decoded.email,
        password: decoded.password
    });
    await newUser.save();

    res.clearCookie("jwt");
    generateToken(res, newUser._id);

    return res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin });
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: "User logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        user.name = req.body.name || user.name;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// ADMIN ACTIONS
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

const getUserByID = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Can't delete admin user");
        }

        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User removed successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin) || Boolean(user.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
        res.status(200).json(user.address);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const addAdress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
        user.address = req.body;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export { loginUser, registerUser, verifyOtpAndRegister, logoutUser, getUserProfile, updateUserProfile, getAllUsers, getUserByID, deleteUser, updateUser, getAddress, addAdress };