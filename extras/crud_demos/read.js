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

    // usersCollectionReference.findOne(
    //   {
    //     name: "Atharva",
    //   },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch from the document");
    //     }
    //     console.log(user);
    //   }
    // );

    // const cursor = usersCollectionReference.find({ age: 19 });
    // cursor.toArray((error, user) => {
    //   console.log(user);
    // });

    // cursor.count((error, count) => {
    //   console.log("Count: %d", count);
    // });

    const tasksCollectionReference = db.collection("tasks");

    tasksCollectionReference.findOne(
      {
        _id: new ObjectId("615951e2a46a6b5cc875c16b"),
      },
      (error, user) => {
        console.log(user);
      }
    );

    const tasksCursor = tasksCollectionReference.find({ completed: false });

    const arr = tasksCursor.toArray((error, task) => {
      console.log(task);
    });
  }
);
