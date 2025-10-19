const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const db = require(path.join(__dirname, "../config/dbConnection.js"));

// Get all todos
router.get("/todos", usersModel.dbTest);

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
