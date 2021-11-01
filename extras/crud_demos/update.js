// Returns a function to connect to our database and perform crud operations
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;

const { MongoClient, ObjectId } = require("mongodb");

// It needs a connectionurl and the name of the database

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to the database");
    }

    // In mongo db there is no need to create a database
    // Just simply accessing a database by its name will create it automatically for us

    console.log("Connected successfully");

    // Returns the reference to the database given in the parentheses
    // If no such database exists it creates a new one for us
    const db = client.db(databaseName);

    const usersCollectionReference = db.collection("users");

    // usersCollectionReference
    //   .updateOne(
    //     {
    //       _id: new ObjectId("615958e58d13299edd656144"),
    //     },
    //     {
    //       $set: {
    //         name: "Apte",
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // usersCollectionReference
    //   .updateOne(
    //     {
    //       _id: new ObjectId("615958e58d13299edd656144"),
    //     },
    //     {
    //       $inc: {
    //         age: 10,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    const tasksCollectionReference = db.collection("tasks");
    tasksCollectionReference
      .updateMany(
        {
          completed: false,
        },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
