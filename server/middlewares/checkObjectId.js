import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
    const { id } = req.params;

    if (isValidObjectId(id)) {
        next();
    } else {
        res.status(400);
        throw new Error("Invalid id");
    }
}

export default checkObjectId;