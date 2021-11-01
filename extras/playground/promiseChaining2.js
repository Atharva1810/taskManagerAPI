require("../src/db/mongoose");

const Task = require("../src/models/task");

// Remove a given task by id

const _id = "615dbf8e76ea7631b7964f7f";
// Task.findByIdAndDelete(_id)
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const deleteTaskAndCount = async (id) => {
  const deleted = await Task.findByIdAndDelete(id);
  console.log(deleted);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount(_id)
  .then((count) => console.log(count))
  .catch((error) => console.log(error));
