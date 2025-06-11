import asyncHandler from "../middlewares/asyncHandler.js";

import User from "../models/userModel.js";

import { generateToken } from "../utils/generateToken.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
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

    const user = await User.create({ name, email, password });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

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

export { loginUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getAllUsers, getUserByID, deleteUser, updateUser, getAddress, addAdress };