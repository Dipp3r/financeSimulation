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
const path = require("path");

// const uploadFolderPath = `./upload`;
// fs.mkdir(uploadFolderPath, { recursive: true }, (err) => {});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance",
  password: "arun",
  port: 5432,
});

// const pool = new Pool({
//   user: "vittaex",
//   host: "localhost",
//   database: "finance",
//   password: "123456",
//   port: 5432,
// });

//middleware
app.use(cors());
app.use(express.json());
app.use(upload());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// function deleteDirectory(directoryPath) {
//   if (fs.existsSync(directoryPath)) {
//     fs.readdirSync(directoryPath).forEach((file) => {
//       const filePath = path.join(directoryPath, file);

//       if (fs.lstatSync(filePath).isDirectory()) {
//         // Recursively delete subdirectories
//         deleteDirectory(filePath);
//       } else {
//         // Delete file
//         fs.unlinkSync(filePath);
//       }
//     });

//     // Delete the empty directory
//     try {
//       fs.rmdirSync(directoryPath);
//       console.log(`Directory ${directoryPath} deleted successfully.`);
//     } catch (err) {
//       console.error(`Error deleting directory ${directoryPath}:`, err);
//     }
//   } else {
//     console.log(`Directory ${directoryPath} does not exist.`);
//   }
// }

// WebSocket server
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.on("message", (message) => {
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

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/test", db.test);
app.post("/createSession", db.addSession);
app.post("/addGroup", db.addGroup);
app.get("/sessions", db.getSessions);
app.post("/groups", db.getGroups);
app.get("/players", db.getPlayers);
app.delete("/deleteGroup", db.deleteGroup);
app.delete("/removeUser", db.removeUser);
app.put("/assignrole", db.alterRole);
app.post("/signup/:id", db.addUser);
app.get("/portfolio/:id", db.getChart);


app.get("/login/:id",async (req,res)=>{
  const [mobile, password] = Object.values(req.body);
  var groupid = Number.parseInt(req.params.id);
  try {
    let result = await pool.query(`
      SELECT password,groupid,userid FROM users WHERE mobile = $1
    `,[mobile]);
    if(result.rowCount>0){
      const [db_password,db_groupid,userid] = Object.values(result.rows[0]);
      if(db_groupid==groupid){
        if(db_password==password){
          try {
            const group = await pool.query(
              'SELECT star FROM "group" WHERE groupid = $1',
              [groupid]
            );
            const [star_count] = Object.values(group.rows[0]);
            res.send({ userid: userid, star_count: star_count }); 
          } catch (error) {
            console.log("Error: " + error.message);
          }
        }else{
          res.status(401).send({ status: false, msg:"Invalid password" });
        }
      }else{
        res.status(400).send({status:false,msg:"You are not a registered user of this group"})
      }
    }else{
      res.status(200).send({status:false,msg:"You are not a registered user"})
    }
  } catch (err) {
    res.status(400).send({status:false,err:err.message})
  }
});

app.get("/team/:id", async (req, res) => {
  const groupid = Number.parseInt(req.params.id);
  try {
    const players = await pool.query(
      "SELECT userid,name,mobile,role FROM users WHERE groupid = $1 ORDER BY created_on DESC, name ASC",
      [groupid]
      );
      res.status(200).send(players.rows);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  });
  
app.get("/news", async (req, res) => {
  try {
    const news = await pool.query("SELECT * FROM gameData");
    res.status(200).send(news.rows);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(400).send({ status: false });
  }
});

app.put("/editTime", async (req, res) => {
  const [year, phase, time] = Object.values(req.body);
  try {
    const response = await pool.query(
      `UPDATE gameData SET phase${phase} = $1 WHERE year = $2`,
      [time, year]
    );
    response
      ? res.status(200).send({ status: true })
      : res.status(400).send({ status: false });
  } catch (err) {
    console.log("Error:" + err.message);
    res.status(400).send({ status: false });
  }
});

app.get("/download/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const filePath = path.join(__dirname, "excelSheets", sessionId + ".xlsx");

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${sessionId}.xlsx`
  );

  res.sendFile(filePath);
});
// app.post("/upload", async (req, res) => {
//   if (req.files) {
//     const [year, phase] = Object.keys(req.files)[0].split("_");
//     const name_ = year + "_" + phase;
//     var file = req.files[name_];

//     const parentDir = `./upload/${year}`;
//     const destination = `./upload/${year}/${phase}`;
//     if (!fs.existsSync(parentDir)) {
//       await fs.mkdir(parentDir, { recursive: true }, (err) => {});
//     }
//     if(fs.existsSync(destination)) {
//       await deleteDirectory(destination);
//     }
//     fs.mkdir(destination, { recursive: true }, (err) => {
//       !err?file.mv(`${destination}/`+file.name.split(" ").join(""),(err)=>{
//       err?console.log(err):res.status(200).send(true);}):res.status(400).send("Error while uploading the file!");
//     });
//   } else {
//     res.status(400).send("false");
//   }
// });

app.put("/renameAsset", async (req, res) => {
  const {assetId, new_name} = req.body;
  try {
    const result = await pool.query(
      `UPDATE assets SET asset_name = $1 WHERE id = $2`,
      [new_name, assetId]
    );
    res.status(200).send({ status: true });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send({ status: false });
  }
});

app.delete("/deleteSession", async (req, res) => {
  const [sessionId] = Object.values(req.body);
  try {
    const promises = [];
    let groups = await pool.query(
      `
      SELECT groupid FROM "group" WHERE sessionid = $1
    `,
      [sessionId]
    );

    if (groups.rowCount === 0) {
      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionId]);
      res.status(200).send({ status: true });
    } else {
      groups = groups.rows;
      for (let i = 0; i < groups.length; i++) {
        let groupid = groups[i].groupid;

        let users = await pool.query(
          `
          SELECT userid FROM users WHERE groupid = $1
        `,
          [groupid]
        );

        if (users.rowCount > 0) {
          users = users.rows;
          const userPromises = [];
          for (let j = 0; j < users.length; j++) {
            let userid = users[j].userid;
            let userPromise = pool.query(
              `DELETE FROM users WHERE userid = $1`,
              [userid]
            );
            userPromises.push(userPromise);
          }
          await Promise.all(userPromises);

          let groupPromise = pool.query(
            `DELETE FROM "group" WHERE groupid = $1`,
            [groupid]
          );
          promises.push(groupPromise);
        } else {
          let groupPromise = pool.query(
            `DELETE FROM "group" WHERE groupid = $1`,
            [groupid]
          );
          promises.push(groupPromise);
        }
      }

      await Promise.all(promises);

      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionId]);
      res.status(200).send({ status: true });
    }
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send({ status: false });
  }
});

app.get("/getAssets", async (req, res) => {
  try {
    const result = await pool.query('SELECT id, asset_type, asset_name FROM assets ORDER BY asset_type, asset_name');
    const assets = {};

    result.rows.forEach(row => {
      const { id, asset_type, asset_name } = row;
      if (!assets.hasOwnProperty(asset_type)) {
        assets[asset_type] = [];
      }
      assets[asset_type].push({ id, name: asset_name });
    });

    // Sort assets swithin each type alphabetically
    Object.keys(assets).forEach(assetType => {
      assets[assetType].sort((a, b) => a.name.localeCompare(b.name));
    });

    res.status(200).json(assets);
  } catch (error) {
    console.error('Error retrieving assets:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put("/renameGroup", async (req, res) => {
  const [groupid, name] = Object.values(req.body);
  try {
    await pool.query(
      `
      UPDATE "group" SET name = $1 WHERE groupid = $2
    `,
      [name, groupid]
    );
    res.status(200).send({ status: true });
  } catch (err) {
    res.status(400).send({ status: false });
  }
});

setInterval(() => {
  wss.broadcast(JSON.stringify({ type: "time", message: "new news" }));
}, 5000);

server.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`);
});
