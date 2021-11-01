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

    // Deleting all users with name: Atharva and age: 19
    usersCollectionReference
      .deleteMany({
        name: "Atharva",
        age: 19,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    const tasksCollectionReference = db.collection("tasks");

    tasksCollectionReference
      .deleteOne({
        description: "Have Breakfast",
      })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }
);
