const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  // task.owner = req.user._id;

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201);
    // Return statement is needed because although we can only send one response the function continues its
    // execution.
    // This might result in some exceptions thrown
    return res.send(task);
  } catch (error) {
    // Setting the status code of the request to 400 for bad request
    res.status(400);
    res.send(error);
  }
});

// Endpoint to get mutliple/all with completed facility tasks

// GET /tasks?completed=true
// GET /tasks?limit=10&page=2
// GET /tasks?sortBy=createdAt:asc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed && req.query.completed === "true") {
    match.completed = true;
  }
  if (req.query.completed && req.query.completed === "false") {
    match.completed = false;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const skip = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    const user = req.user;
    await user.populate({
      path: "tasks",
      match,
      options: {
        limit,
        skip,
      },
    });

    return res.send(user.tasks);
    // await req.user.populate("tasks").execPopulate();
    // return res.send(req.user.tasks);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

// Endpoint to get a single task by the id
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      res.status(404);
      return res.send("No such task exists");
    }
    return res.send(task);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const allowedUpdates = ["description", "completed"];
    const givenUpdates = Object.keys(req.body);
    const isValidUpdate = givenUpdates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      res.status(400);
      return res.send("Not a valid update");
    }
    const finalUpdates = req.body;

    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("No task with given id");
    }

    givenUpdates.forEach((update) => (task[update] = finalUpdates[update]));

    await task.save();

    // const task = await Task.findByIdAndUpdate(id, update, {
    //   new: true,
    //   runValidators: true,
    // });

    return res.send(task);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("No task found with given id");
    }
    return res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
