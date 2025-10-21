const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const db = require(path.join(__dirname, "../config/dbConnection.js"));

//Get method login

router.get("/login", usersControllers.loginPage);

router.get("/register", usersControllers.signUpPage);

// Post method login

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

router.get("/logout", usersControllers.logout);

//Get method user

router.get("/searchUser", usersControllers.searchUseForm);

router.get("/addUser", usersControllers.userForm);

router.get("/deleteUser", usersControllers.deleteUserForm);

// POST method user

router.post("/userAdd", usersControllers.userAdd);

router.post("/userDelete", usersControllers.deleteUser);

router.post("/searchUser", usersControllers.searchUser);

// Get method todo app

router.get("/todos", usersControllers.getAllUsers);

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

// POST method todo app

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
