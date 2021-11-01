const mongoose = require("mongoose");

// Similar to creating a schema in sql using create table
// All the fields of the model will have an object which holds all validation
const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,

      validate(value) {
        if (value.length === 0) {
          throw new Error("Please enter description");
        }
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },

    // Foreign key concept
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Ref similar to foreing key
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

// const task = new Task({
//   description: "Poo in the loo",
//   completed: true,
// });

// task
//   .save()
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

module.exports = Task;
