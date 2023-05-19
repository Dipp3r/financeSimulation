const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;
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
  

  app.get("/test",db.test);

  app.listen(port, () => {
    console.log(`App running on port http://localhost:${port}.`);
});