const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./queries");
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
  });
  
  app.get("/login", db.getUser);
  app.get("/profile",db.getStarCount);
  app.post("/createSession",db.addSession);
  app.get("/sessions",db.getSessions);
  app.get("/groups",db.getGroups);
  app.get("/players",db.getPlayers);
  app.post("/assign_role",db.alterRole);
  app.post("/addGroup",db.addGroup);
  app.post("/removeUser",db.removeUser);
  app.post("/deleteGroup",db.deleteGroup);
  
  app.listen(port, () => {
    console.log(`App running on port http://localhost:${port}.`);
});