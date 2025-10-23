const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const db = require(path.join(__dirname, "../config/dbConnection.js"));

const { uploadMiddleware } = require(path.join(__dirname, "../middlewares/uploadMiddleware.js"));

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
