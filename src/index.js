const express = require("express");
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");

// Just calling the require function and not saving the reference because we are just making the code responsible
// for connecting to the database runs in the mongoose.js file
require("./db/mongoose");
// Running the application
const app = express();
// Registering the port of the application
const port = process.env.PORT;

// It automatically parses the incoming json to object
app.use(express.json());

// Registers all different routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port ", port);
});

/*

Without Middleware:       new request -> run route handler

With Middleware:          new request -> do something -> run route handler

*/
