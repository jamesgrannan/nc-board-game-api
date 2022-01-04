const { getAllUsers } = require("../controllers/users.controller");
const userRouter = require("express").Router();

userRouter.get("/", getAllUsers);

module.exports = userRouter;
