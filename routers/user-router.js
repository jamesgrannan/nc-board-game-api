const { wrongMethod } = require("../controllers/api-controller");
const { getAllUsers, getUser } = require("../controllers/users.controller");
const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers).all(wrongMethod);
userRouter.route("/:username").get(getUser).all(wrongMethod);

module.exports = userRouter;
