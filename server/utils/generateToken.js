import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};

const generateAuthToken = (res, payload) => {
    const token = jwt.sign({ ...payload, purpose: "auth" }, process.env.JWT_SECRET, {
        expiresIn: "10m"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 10 * 60 * 1000 // 10 min
    });

    return token;
};

export { generateToken, generateAuthToken };