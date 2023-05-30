const express = require("express");
const EventEmitter = require("events");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;
const db = require("./queries");
const cors = require("cors");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance",
  password: "arun",
  port: 5432,
});

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

app.get("/test", db.test);
app.post("/createSession", db.addSession);
app.post("/addGroup",db.addGroup);
app.get("/sessions",db.getSessions);
app.post("/groups",db.getGroups);
app.get("/players",db.getPlayers);
app.delete("/deleteGroup",db.deleteGroup);
app.delete("/removeUser",db.removeUser);
app.put("/assignrole",db.alterRole);
app.post("/login/:id", db.addUser);
app.get("/portfolio/:id",db.getChart);

app.get("/team/:id",
async (req,res)=>{
  const groupid = Number.parseInt(req.params.id);
  try {
    const players = await pool.query('SELECT userid,name,mobile,role FROM users WHERE groupid = $1',[groupid]);
    res.status(200).send(players.rows);
  } catch (error) {
    console.log("Error: " + error.message);
  }
}
);



app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`);
});
