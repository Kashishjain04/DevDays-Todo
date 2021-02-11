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
      // case "update":
      //   channel = "update";
      //   break;

      // done ??
      // pusher working other than add? -- Na -- why
      // pusher to document dedega jo update hui h, ab usko react m kaise handle krna h wo nhi ho rha na
      // btw i removed the alert on addition of todos
      // ohh badhiya
      // ye kal soche ya abhi krna hai?
      // kl late ya parso jaldi
      // kl din me m bahr hu
      // oh kie
      // kab ana wo to wsaap pe dekh lenge
      // 👍🏻
      // kaam pusher ke alava animations set krna hai
      // then auth ... right??
      // 👍🏻
      // bhut sahi
      // live share be like - sale wssap hu kya
      // 🤣 👏🏻 🌃
      // ye coding hai live share pe😂
      // 😴 ❓ 🕙
      // 🛌🏻 ::oh ma gu nyt . -- me leave kr ra hu fir ab gn, kr nhi to m nikal deta hu tu jaega to mera bhi diconnect ho hi jaega, chala ja bh@sdike  bhasdi 😂 -- 😂😂 reaction bhi copy-paste 😂 -- nai nai  type kia mene to -- m apni bat kr rha tha -- OVER n OUT
      // pada rehne de, kl dekhenge to thoda hs bhi lenge dobara
      // second last msg padhke zada hasenge, lol -- 🤣 (ab m us second ko third nhi krna chahta) waha bhi loop ctr lagau kya ab BYE-BYE shubh ratri --
      // case "delete":
      //   channel = "delete";
      //   break;

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

app.get("/todos/", async (req, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

app.post("/todos", (req, res) => {
  Todo.create(req.body.todo, (err, doc) => {
    if (err) {
      res.send(err).status(404);
    } else {
      console.log(doc);
      res.send("Todo Added successfully !!");
    }
  });
});

app.put("/todos", (req, res) => {
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

app.delete("/todos", (req, res) => {
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
