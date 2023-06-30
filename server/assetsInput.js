const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const port = 3003;
const db = require("./queries");
const cors = require("cors");
const Pool = require("pg").Pool;
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const upload = require("express-fileupload");
const fs = require("fs");
const path = require('path');

const pool = new Pool({
  user: "vittaex",
  host: "localhost",
  database: "finance",
  password: "123456",
  port: 5432,
});
const assets  = require("./assetsName.json")

function addAssets(){
  let assetsNames = JSON.parse(assets);
  console.log(assetsNames)
}
addAssets()