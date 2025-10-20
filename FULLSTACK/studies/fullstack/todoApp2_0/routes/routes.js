const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const db = require(path.join(__dirname, "../config/dbConnection.js"));

//Get method user

router.get("/addUser", usersControllers.userForm);

router.get("/deleteUser", usersControllers.deleteUserForm);

// POST method user

router.post("/userAdd", usersModel.addUser);

router.post("/userDelete", usersModel.deleteUser);

// Get method todo app

router.get("/todos", usersModel.dbTest);

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

// POST method todo app

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
