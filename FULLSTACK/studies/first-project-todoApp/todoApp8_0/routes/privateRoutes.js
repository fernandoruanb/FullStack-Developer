const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

const { validatorMiddleware } = require(path.join(__dirname, "../middlewares/validatorMiddleware.js"));
const { uploadMiddleware } = require(path.join(__dirname, "../middlewares/uploadMiddleware.js"));

// See all users

router.get("/getAllUserList", usersControllers.getAllUsersList);

router.get("/seeProfile", usersControllers.seePublicProfile);

// Confirm E-mail

router.get("/confirmEmail", usersControllers.sendConfirmationEmail);

router.post("/confirmEmail", usersControllers.verifyConfirmationCode);

// Username

router.get("/deleteAccount", usersControllers.deleteEverything);

router.get("/profile", usersControllers.showUserProfile);

router.get("/changeUsername", usersControllers.getChangeUsernamePage);

router.post("/changeUsername", usersControllers.postChangeUsername);

// Password

router.get("/changePassword", usersControllers.getChangePasswordPage);

router.post("/changePassword", usersControllers.postChangePassword);

// Channels

router.get("/channels", usersControllers.getChannelsPage);

//GET 2fa

router.post("/verify2faDirect", usersControllers.verify2faDirect);

router.get("/2fa", usersControllers.get2faPage);

router.post("/verify2fa", usersControllers.verify2fa);

//GET method login

router.get("/login", usersControllers.loginPage);

router.get("/getDashboard", usersControllers.getDashBoard);

router.get("/register", usersControllers.signUpPage);

// POST method login

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

router.get("/logout", usersControllers.logout);

//GET method user

router.get("/searchUser", usersControllers.searchUseForm);

router.get("/addUser", usersControllers.userForm);

router.get("/deleteUser", usersControllers.deleteUserForm);

// POST upload

router.post("/uploadAvatar", uploadMiddleware.single("avatar"), usersControllers.uploadAvatar);

// POST method user

router.get("/userDelete/:id", usersControllers.deleteUserById);

router.post("/userAdd", usersControllers.userAdd);

router.post("/userDelete", usersControllers.deleteUser);

router.post("/searchUser", usersControllers.searchUser);

// GET method todo app

router.get("/buttonUpdateTask/:task", usersControllers.buttonUpdateTask);

router.get("/addTodoTaskPage", usersControllers.addTodoTaskPage);

router.get("/todos", usersControllers.getAllUsers);

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

// POST method todo app

router.post("/buttonCompleteTask", usersControllers.completeUserTask);

router.post("/updateUserTask", usersControllers.updateUserTask);

router.post("/buttonDeleteTask", usersControllers.buttonDeleteTask);

router.post("/addTodoTask", usersControllers.addTodoTask);

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
