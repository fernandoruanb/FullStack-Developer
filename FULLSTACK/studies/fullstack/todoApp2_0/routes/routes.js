const express = require("express");
const path = require('path');
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const db = require(path.join(__dirname, "../config/db.js"));

// Get all todos
router.get("/todos", (req, res) => {
  db.query("SELECT * FROM todo", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get("/", usersControllers.getTodoApp);

router.get("/addTask", usersControllers.getForm);

router.get("/deleteTask", usersControllers.deleteForm);

router.post("/updateTodoApp", usersControllers.addTodo);

router.post("/deleteTask", usersControllers.deleteTodo);

module.exports = router;
