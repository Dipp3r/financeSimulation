const express = require("express");
const app = express();
const port = 3000;
// const db = require("./queries");
const path = require("path")



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '/build')))

//express routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
// WebSocket server
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`You sent: ${message}`);
  });
});

wss.broadcast = function (data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

setInterval(()=>{
  wss.broadcast(JSON.stringify({type:"time",message:"new news"}))
},5000)

server.listen(port, () => {
  console.log(`Server is listening on port https://localhost:${port}`);
});