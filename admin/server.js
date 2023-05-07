const express = require("express");
const app = express();
const port = 3002;
// const db = require("./queries");
const path = require("path")

const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(express.static(path.join(__dirname, '/build')))

//express routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});




// WebSocket server
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`You sent: ${message}`);
  });
});

app.listen(port,(err)=>{
    console.log(`server : http://localhost:${port}`)
    if (err) console.log(err)
})