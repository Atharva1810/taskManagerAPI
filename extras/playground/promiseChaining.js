require("../../src/db/mongoose");

const User = require("../../src/models/user");

const _id = "615eed9a46c3a6b430aebeb2";

// User.findByIdAndUpdate(_id, {
//   age: 1,
// })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((users) => {
//     console.log(users);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount(_id, 5)
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
