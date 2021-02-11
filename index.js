import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Pusher from "pusher";
import Todo from "./models/todoModel.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// configure pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

// configure db
const db = mongoose.connection;
const CONNECTION_URL = process.env.DB_LINK;
const DEPRECATED_FIX = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

db.on("error", (error) => console.log("❌ MongoDB:", error)); // listen for errors after the connection is established (errors during the session)
db.on("disconnected", () => console.log("❌ MongoDB disconnected"));

db.once("open", () => {
  console.log("✅ MongoDB connected");
  const todoCollection = db.collection("todos");
  const changeStream = todoCollection.watch({ fullDocument: "updateLookup" });

  changeStream.on("change", (change) => {
    let channel;
    const todoDetails = change.fullDocument;
    let flag = true;
    switch (change.operationType) {
      case "insert":
        channel = "inserted";
        break;
      case "update":
        channel = "updated";
        break;

      case "delete":
        channel = "deleted";
        break;

      default: {
        // console.log("Error Triggering Pusher");
        flag = false;
      }
    }
    flag &&
      pusher
        .trigger("todos", channel, {
          todoDetails,
        })
        .catch((err) => {
          console.log(err.message);
        });
  });
});

// connect to db
mongoose
  .connect(CONNECTION_URL, DEPRECATED_FIX)
  .catch((error) => console.log("❌ MongoDB:", error)); // listen for errors on initial connection

app.get("/all", async (req, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

app.post("/add", (req, res) => {
  Todo.create(req.body.todo, (err, doc) => {
    if (err) {
      res.send(err).status(404);
    } else {
      res.send("Todo Added successfully !!");
    }
  });
});

app.put("/check", (req, res) => {
  Todo.findByIdAndUpdate(
    req.body.todo._id,
    { check: !req.body.todo.check },
    (err, doc) => {
      if (err) {
        res.send(err).status(404);
      } else {
        res.send("Todo Updated successfully !!");
      }
    }
  );
});

app.delete("/delete", (req, res) => {
  Todo.findByIdAndDelete(req.body._id, (err, docs) => {
    if (err) {
      res.send(err).status(404);
    } else {
      res.send("Todo Deleted successfully !!");
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Started on 5000");
});
