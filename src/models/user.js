// Enhanced mongodb driver based upon native mongodb driver for nodejs
const mongoose = require("mongoose");
// For validation of data
const { default: validator } = require("validator");
// For hashing the password
const bcrypt = require("bcrypt");
// For authentication and token managment
// jwt: JSON Web Token
const jwt = require("jsonwebtoken");
// Task model
const Task = require("./task");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Entered email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password should not contain password");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age can't be negative");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
      // Buffer for binary data like images
    },
  },
  {
    timestamps: true,
  }
);

// Setups something like a virtual table
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// Methods which leave on the instance i.e Instance methods
// i.e. user.<method_name>
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens.push({ token });

  await user.save();
  return token;
};

// Overriding the toJSON method that express calls when we res.send an object
// That is express converts any object send to JSON using toJSON method which we can override
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

// Methods that leave on the model ie. Static methods
// i.e. User.<method_name>
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("The user with given email doesnt exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Entered password is incorrect");
  }
  return user;
};

// Note:
// 1. As we need 'this' reference in the function we can't use arrow functions here as arrow funcs dont provide
//    this binding

// 2. 'save' is a type of middleware method

// 3. pre function runs before saving anything to the database

// Hashing the password before saving it
userSchema.pre("save", async function (next) {
  // Saving reference of this in a constant
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // Calling next signals that the function is over
  // It's very important to call next otherwise application will wait forever to end.
  next();
});

// Deleting all users when the user is removed from the the database
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// Creating the user model
const User = mongoose.model("User", userSchema);

// Now we can create any number of instances of this model
// const me = new User({
//   name: "Pant",
//   email: "tingu@mingu.poo",
//   // password: "passwo",
// });

// me.save()
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

module.exports = User;
