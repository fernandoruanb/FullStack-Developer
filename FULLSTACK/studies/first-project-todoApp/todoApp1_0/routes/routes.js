const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
