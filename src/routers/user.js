const express = require("express");
const multer = require("multer");
// For image formatting of profile pictures
const sharp = require("sharp");

const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const router = express.Router();
const upload = multer({
  /// Once destination is removed the file will be available on req.file
  // dest: "uploads/avatars",
  limits: {
    // Setting file size limit to 1e6 bytes i.e. 1 MB
    fileSize: 1e6,
  },

  // This method is called before a file is saved to the server
  // cb: callback method to be called when either saving or throwing an error
  fileFilter(req, file, cb) {
    // cb config
    // cb(error):             sends the error to user. Doesn't save file
    // cb(undefined, true)    undefined for 1st arg shows that no error occured and true tells to save the file
    // cb(undefined, false)   same as above but doesnt save the file to the server

    // Using regex to check is the given file is of the correct extension
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Profile picture should be jpg jpeg png format"));
    }

    // Saving the file by callback
    cb(undefined, true);
  },
});

// Will only work for I REPEAT for will only work for POST requests
// That is GET request or for that matter any type of other requests are not gonna work on this /users endpoint

// ********************************         Create User       ****************************************************//
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201);
    // Return statement is needed because although we can only send one response, the function continues its
    // execution.
    // This might result in some exceptions thrown
    return res.send({ user, token });
  } catch (error) {
    res.status(400);
    return res.send(error);
  }

  // user
  //   .save()
  //   .then(() => {
  //     res.status(201);
  //     res.send(user);
  //   })
  //   .catch((error) => {
  //     res.status(400);
  //     res.send(error);
  //   });
});

// ***********************************          Login User       *************************************************//
router.post("/users/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error.toString());
  }
});

// *************************************        User Profile      ************************************************//

// Endpoint to read all the users in the database

// Passing auth as 2nd argument middleware which ensures that the function auth runs before the function for the
// route handler
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// ************************************         Logout User      *************************************************//
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send("Token deleted successfully");
  } catch (error) {
    res.status(500).send("Token couldnt be deleted");
  }
});

// ********************************     Logout all tokens      ***************************************************//
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("All Token sdeleted successfully");
  } catch (error) {
    res.status(500).send("All Tokens couldnt be deleted");
  }
});

// ************************************     User Profile      ****************************************************//

// Setting up a dynamic route by adding a colon:
// Express will send us an object present on req named params which will contain all such dynamice values
// as key value pairs

// // Endpoint to read a single user by id
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send("No user found with given id");
//     }
//     return res.send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
//   // const user = User.findById(_id)
//   //   .then((user) => {
//   //     if (!user) {
//   //       res.status(404).send();
//   //     }
//   //     res.send(user);
//   //   })
//   //   .catch((error) => console.log(error));
// });

// ****************************************     Update User  ****************************************************//
router.patch("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
  const givenUpdates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "password", "email"];
  const isValidOperation = givenUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  try {
    if (!isValidOperation) {
      return res.status(400).send("Not a valid update");
    }

    const finalUpdates = req.body;

    // **************************     NOTE    ******************************************
    // As findByIdAndUpdate method bypasses the mongoose we avoid it because we store password as hash

    const user = req.user;

    for (const update in finalUpdates) {
      user[update] = finalUpdates[update];
    }

    // Alternate method using foreach
    // givenUpdates.forEach((update) => (user[update] = finalUpdates[update]));

    await user.save();
    return res.send(user);
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
});

// *************************************         Delete User      ***********************************************//
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    await sendCancelationEmail(req.user.email, req.user.name);
    await req.user.remove();
    return res.send(req.user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// **********************************   Add Profile Picture  ***************************************************

// Using the multer middleware package
// Returns the middleware: avatar in this case
// Middleware searches for key: 'avatar' and uploads it to the dest in the options
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);
// The second function which is provided as the callback is called when the middlware throws an error
// We get the error req res and next parameters when the above event happens

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No such resource exists");
    }
    // Setting the response header to the following key: value pair
    res.set("Content-type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
