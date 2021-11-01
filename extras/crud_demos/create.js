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

    // Terminology

    // SQL -------------- NoSQL
    // Database --------- Database
    // Table ------------ Collection
    // Row -------------- Document
    // Column ----------- Field

    // Example

    // 1. SQL

    // Table name: Users
    // ID   Name      Age
    // 10   Atharva   19
    // 20   Santosh   33
    // 30   Charlie   12

    // Table Name: Cars

    // ID   Car1          Car2
    // 10   WagonR        null
    // 20   Honda City    Alto
    // 30   null          null

    // 2. NoSQL

    /* -----> Users Collection <------
    [
      {
        "id": 10
        "name": "Atharva",
        "age": 19
      },
      {
        "id": 20
        "name": "Santosh",
        "age": 33
      },
      {
        "id": 30
        "name": "Charlie",
        "age": 12
      },
    ]
    */

    /* ----> Cars Collection <----
    [
      {
        "id": 10
        "car1": "WagonR"
        "car2": null
      },
      {
        "id": 20
        "car1": "Honda City"
        "car2": "Alto"
      },
      {
        "id": 30
        "car1": null
        "car2": null
      },
    ]
    */

    // As connecting to database is not synchronous same inserting or for that matter any operation on the
    // database is also asynchronous
    // Hence we provide a callback function to the insert methods where it runs after either doc was inserted or
    // there was an error

    const usersCollectionReference = db.collection("users");

    usersCollectionReference.insertOne(
      {
        name: "Atharva",
        age: 18,
        city: "Pune",
      },
      (error, result) => {
        if (error) {
          return console.log("Unable to insert the document");
        }
        console.log("The inserted document is");
        console.log(result);
      }
    );

    usersCollectionReference.insertOne({
      name: "Roger",
      age: 39,
    });

    const tasksCollectionReference = db.collection("tasks");

    // tasksCollectionReference.insertMany(
    //   [
    //     {
    //       description: "Study MongoDB",
    //       completed: false,
    //     },
    //     {
    //       description: "Learn Guitar",
    //       completed: false,
    //     },
    //     {
    //       description: "Have Breakfast",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert the document/s");
    //     }
    //     console.log("The inserted document are:");
    //     console.log(result);
    //   }
    // );
  }
);
