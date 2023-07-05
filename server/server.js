const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const port = 3003;
const cors = require("cors");
const Pool = require("pg").Pool;
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const upload = require("express-fileupload");
// const fs = require("fs");
const path = require("path");

const DATA = require("./info.json");

// const uploadFolderPath = `./upload`;
// fs.mkdir(uploadFolderPath, { recursive: true }, (err) => {});

//INITIALIZING VITTAE COIN

const COINS = 500000;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "finance",
//   password: "arun",
//   port: 5432,
// });

const pool = new Pool({
  user: "vittaex",
  host: "localhost",
  database: "finance",
  password: "123456",
  port: 5432,
});

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
  jsonData = JSON.stringify(data);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonData);
    }
  });
};

const updateGame = async (
  phase = 1,
  year = 1,
  lastYear = 0,
  session,
  groups
) => {
  if (phase >= 5) {
    phase = 1;
    for (let group of groups) {
      await pool.query(`
        UPDATE "group" set cash = cash + ${COINS} WHERE groupid = ${group["groupid"]}
      `);
    }
    wss.broadcast({ cash: COINS, msgType: "CashUpt" });
    year++;
  }
  if (year <= lastYear) {
    try {
      const query = `SELECT phase${phase} FROM gamedata WHERE year = $1 ORDER BY year ASC`;
      const result = await pool.query(query, [year]);
      const time = result.rows[0][`phase${phase}`];
      const [hours, minutes, seconds] = time.split(":");
      const totalSeconds = Number.parseInt(
        hours * 3600 + minutes * 60 + seconds
      );
      await pool.query(
        `
        UPDATE "session" SET year = $1, phase = $2 where sessionid = $3
      `,
        [year, phase, session]
      );

      console.log("year: ", year, " phase:", phase, " sec: ", totalSeconds);
      let obj = {};
      obj.msgType = "GameChg";
      obj.year = year;
      obj.phase = phase;
      obj.time = time;

      wss.broadcast(obj);

      setTimeout(
        () => updateGame(phase + 1, year, lastYear, session, groups),
        Number.parseInt(totalSeconds) * 1000
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

app.post("/start", async (req, res) => {
  const { sessionid } = req.body;
  console.log(sessionid);
  let result = await pool.query("select year from gameData ORDER BY year ASC");
  let [firstyear, lastYear] = [result.rows[0].year, result.rows.pop().year];
  const groups = await pool.query(`
    SELECT groupid FROM "group" WHERE sessionid = ${sessionid}
  `);
  for (let group of groups.rows) {
    await pool.query(`
      UPDATE "group" set cash = cash + ${COINS} WHERE groupid = ${group["groupid"]}
    `);
  }
  wss.broadcast({ cash: COINS, msgType: "CashUpt" });
  updateGame(1, firstyear, lastYear, sessionid, groups.rows);
  res.status(200).end();
});

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

//API for testing

app.get("/test", async (req, res) => {
  try {
    const sessions = await pool.query('SELECT * FROM "group"');
    res.send(sessions.rows);
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
});

//API(s) FOR ADMIN

app.post("/createSession", async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const { title } = request.body;
  if (title.length > 0) {
    try {
      let firstYear = await pool.query(`
        SELECT year FROM gamedata ORDER BY year LIMIT 1
      `);
      firstYear = firstYear.rows[0]["year"];
      await pool.query(
        "INSERT INTO session(sessionid,title,excelLink,time_created,year,phase) VALUES($1,$2,$3,$4,$5,$6)",
        [id, title, "", new Date(), firstYear, 1]
      );
      response.status(200).send({ status: true });
    } catch (error) {
      console.log("Error: " + error.message);
      response.status(500).send("Error");
    }
  } else {
    response.status(200).send({ status: true });
  }
});

app.post("/addGroup", async (request, response) => {
  let allYears = "";
  DATA.year.forEach((e) => {
    allYears += `_${e}, `;
  });
  allYears = allYears.trim().replace(/,$/, "");
  let id = Math.floor(100000 + Math.random() * 900000);
  const { name, limit, sessionid } = request.body;
  console.log(request.body);
  if (name.length > 0) {
    try {
      if (!Number.isInteger(limit)) {
        throw new Error("Invalid limit. Please provide a valid integer value.");
      }
      await pool.query(
        `INSERT INTO "group"(groupid, name, _limit, cash, sessionid, players, star, time_created, ${allYears}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, 0, 0, 0, 0, 0,0)`,
        [id, name, limit, 0, sessionid, 0, 0, new Date()]
      );
      response.status(200).send({ status: true });
    } catch (error) {
      console.log(error);
      response.status(400).send("Error: " + error.message);
    }
  } else {
    response.status(200).send({ status: true });
  }
});

app.get("/sessions", async (request, response) => {
  try {
    var sessions = await pool.query(
      "SELECT * FROM session ORDER BY time_created DESC"
    );
    const players =
      await pool.query(`SELECT "group".sessionid, SUM("group".players)
      FROM "group"
      JOIN "session" ON "session".sessionid = "group".sessionid
      GROUP BY "group".sessionid`);
    const groups = await pool.query(
      `select "group".sessionid,count(sessionid) from "group" group by "group".sessionid;`
    );
    sessions.rows.forEach((element) => {
      element.players = "0";
      element.groups = "0";
      players.rows.forEach((player) => {
        if (element.sessionid == player.sessionid) {
          element.players = player.sum;
        }
      });
      groups.rows.forEach((group) => {
        if (element.sessionid == group.sessionid) {
          element.groups = group.count;
        }
      });
    });
    console.log(sessions.rows);
    response.send(sessions.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
});

app.post("/groups", async (request, response) => {
  const { sessionid } = request.body;
  try {
    const groups = await pool.query(
      'SELECT groupid,name,players FROM "group" WHERE sessionid=$1 ORDER BY time_created DESC',
      [sessionid]
    );
    response.send(groups.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
});

app.get("/players", async (request, response) => {
  const { groupid } = request.body;
  try {
    const players = await pool.query(
      "SELECT userid,name,mobile,role from users WHERE groupid=$1",
      [groupid]
    );
    response.send(players.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
});

app.delete("/deleteGroup", async (request, response) => {
  const { groupid } = request.body;
  try {
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
        let userPromise = pool.query(`DELETE FROM users WHERE userid = $1`, [
          userid,
        ]);
        userPromises.push(userPromise);
      }
      await Promise.all(userPromises);
      try {
        await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [groupid]);
      } catch (err) {
        response.status(400).send("Error: " + err.message);
      }
    } else {
      try {
        await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [groupid]);
      } catch (err) {
        response.status(400).send("Error: " + err.message);
      }
    }
    response.status(200).send({ status: true });
  } catch (err) {
    response.status(400).send("Error: " + err.message);
  }
});

app.delete("/removeUser", async (request, response) => {
  const { userid } = request.body;
  try {
    await pool.query(
      `
    UPDATE "group"
    SET players = players - 1
    WHERE groupid = (SELECT groupid FROM users WHERE userid = $1);
    `,
      [userid]
    );
    let groupid = await pool.query(
      `
      select groupid from users where userid = $1
    `,
      [userid]
    );
    await pool.query("DELETE FROM users WHERE userid=$1", [userid]);

    groupid = groupid.rows[0].groupid;
    wss.broadcast({
      userid: userid,
      groupid: groupid,
      msgType: "RemoveUser",
    });
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
});

app.put("/assignrole", async (request, response) => {
  const { userid, role } = request.body;
  try {
    if (role == "0") {
      const exe = await pool.query(
        `
      UPDATE users SET role = '' WHERE userid = (SELECT userid FROM users WHERE groupid = (SELECT groupid FROM users WHERE userid = $1) AND role = '0')
    `,
        [userid]
      );
    }
    await pool.query("UPDATE users SET role = $1 WHERE userid = $2", [
      role,
      userid,
    ]);
    let groupid = await pool.query(
      `
      select groupid from users where userid = $1
    `,
      [userid]
    );
    let userName = await pool.query(
      `
      select name from users where userid = $1
    `,
      [userid]
    );
    groupid = groupid.rows[0].groupid;
    userName = userName.rows[0].name;
    wss.broadcast({
      userid: userid,
      groupid: groupid,
      name: userName,
      role: role,
      msgType: "RoleChg",
    });
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
});

//API(s) FOR PUBLIC

//assign grp-id based on the unique link
//FORMAT request.body = {"name":"Narayanan", "mobile":"0987654321","password":"yan#123"}

app.post("/signup/:id", async (request, response) => {
  const { name, mobile, password } = request.body;
  var groupid = Number.parseInt(request.params.id);
  console.log(groupid,name, mobile, password);
  try {
    const user = await pool.query("SELECT groupid FROM users WHERE mobile=$1", [
      mobile,
    ]);
    console.log(user.rowCount);
    if (user.rowCount == 0) {
      let id = Math.floor(100000 + Math.random() * 900000);
      try {
        console.log(groupid,name, mobile, password);
        const _limit = await pool.query(
          'select _limit as limit,players from "group" where groupid=$1',
          [groupid]
        );
        const {limit, players} = _limit.rows[0];
        if(limit>players){
          await pool.query(
            "INSERT INTO users (userid,name,mobile,password,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $6,$7)",
            [id, name, mobile, password, groupid, "", new Date()]
          );
          await pool.query('update "group" set players = players + 1 where groupid=$1',[
            groupid,
          ]);
          wss.broadcast({
            userid: id,
            groupid: groupid,
            name: name,
            msgType: "NewUser",
          });
          response.status(200).send({ userid: id, star_count: 0 });
        }else{
          response.status(400).send({ status:false,msg:"The group limit exceeded"});
        }
      } catch (error) {
        console.log("Error: " + error.message);
        response.status(400).send({ status: false });
      }
    } else {
      let [id] = Object.values(user.rows[0]);
      console.log(id);
      id == groupid
        ? response
            .status(400)
            .send({ status: false, msg: "You are already a registered user" })
        : response.status(400).send({
            status: false,
            msg: "You are not authorized to enter this group",
          });
    }
  } catch (error) {
    console.log("error" + error.message);
  }
});

app.get("/portfolio/:id", async (request, response) => {
  const groupid = request.params.id;
  let networth = 0,
    overall = 0;
  const result = {};
  // const ratio  = (numerator,base)=>{
  //   if(numerator!==0){
  //     return Number.parseInt(Math.round((numerator/base)*100));
  //   }
  //   return 0;
  // }
  try {
    let gamedata = await pool.query(`
      SELECT year,phase FROM "session" WHERE sessionid = (SELECT sessionid FROM "group" WHERE groupid = ${groupid});
    `);
    const { year, phase } = gamedata.rows[0];

    let cashAmt = await pool.query(
      'SELECT cash FROM "group" WHERE groupid = $1',
      [groupid]
    );
    cashAmt = cashAmt.rows[0];
    result["cash"] = cashAmt.cash;
    networth += cashAmt.cash;

    let products = await pool.query(`
      SELECT assets.asset_type, SUM(investment.holdings) AS value
      FROM assets
      JOIN investment ON assets.id = investment.stockid
      WHERE investment.groupid = ${groupid}
      GROUP BY assets.asset_type
    `);
    products = products.rows;

    // const {stock, commodity, cash, mutualFund} = result;

    const holding_diff = await pool.query(`
      SELECT t1.asset_type, SUM(t2.holdings * t3.phase${phase}_diff/100) AS holding_diff
      FROM assets AS t1
      JOIN investment AS t2 ON t1.id = t2.stockid
      JOIN price_${year} t3 ON t2.stockid = t3.asset_id
      WHERE t2.groupid = ${groupid}
      GROUP BY t1.asset_type;
    `);

    console.log(holding_diff.rows);
    if(products.length>0){
      products.forEach((e) => {
        result[e.asset_type] = Number.parseInt(e.value);
        networth = networth + Number.parseInt(e.value);
      });
    }else{
      let assetsTypes = await pool.query(`
        SELECT DISTINCT asset_type FROM assets
      `);
      assetsTypes = assetsTypes.rows;
      assetsTypes.forEach((e) => {
        result[e.asset_type] = 0;
        result[e.asset_type + "_diff"] = 0;
      });
    }
    
    result["networth"] = networth;
    if(holding_diff.rows.length>0){
      holding_diff.rows.forEach((e) => {
        result[e.asset_type + "_diff"] = Number.parseInt(e.holding_diff);
        overall += Number.parseInt(e.holding_diff);
      });
    }

    result["overall"] = overall;
    overall?result["overall_diff"] = Math.round((overall / networth) * 100 * 100) / 100:result["overall_diff"] = 0;

    let yearly = await pool.query(`
      SELECT _${year} from "group" where groupid = ${groupid}
    `);
    yearly = yearly.rows[0][`_${year}`];
    result["yearly"] = yearly;
    yearly?result["yearly_diff"] = Math.round((yearly / networth) * 100 * 100) / 100:result["yearly_diff"] = 0;

    response.status(200).send(result);
  } catch (error) {
    console.log("Error: " + error.message);
  }
});

app.post("/login/:id", async (req, res) => {
  const { mobile, password } = req.body;
  var groupid = Number.parseInt(req.params.id);
  try {
    let result = await pool.query(
      `
      SELECT password,groupid,userid FROM users WHERE mobile = $1
    `,
      [mobile]
    );
    if (result.rowCount > 0) {
      const [db_password, db_groupid, userid] = Object.values(result.rows[0]);
      if (db_groupid == groupid) {
        if (db_password == password) {
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
        } else {
          res.status(401).send({ status: false, msg: "Invalid password" });
        }
      } else {
        res.status(400).send({
          status: false,
          msg: "You are not a registered user of this group",
        });
      }
    } else {
      res
        .status(400)
        .send({ status: false, msg: "You are not a registered user" });
    }
  } catch (err) {
    res.status(400).send({ status: false, err: err.message });
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
    const news = await pool.query("SELECT * FROM gameData ORDER BY year ASC");
    res.status(200).send(news.rows);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(400).send({ status: false });
  }
});

app.put("/editTime", async (req, res) => {
  const { year, phase, time } = req.body;
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
  const { assetId, new_name } = req.body;
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
  const { sessionid } = req.body;
  try {
    const promises = [];
    let groups = await pool.query(
      `
      SELECT groupid FROM "group" WHERE sessionid = $1
    `,
      [sessionid]
    );

    if (groups.rowCount === 0) {
      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionid]);
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

      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionid]);
      res.status(200).send({ status: true });
    }
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send({ status: false });
  }
});

app.get("/getAssets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, asset_type, asset_name FROM assets ORDER BY asset_type, asset_name"
    );
    const assets = {};

    result.rows.forEach((row) => {
      const { id, asset_type, asset_name } = row;
      if (!assets.hasOwnProperty(asset_type)) {
        assets[asset_type] = [];
      }
      assets[asset_type].push({ id, name: asset_name });
    });

    // Sort assets swithin each type alphabetically
    Object.keys(assets).forEach((assetType) => {
      assets[assetType].sort((a, b) => a.name.localeCompare(b.name));
    });

    res.status(200).json(assets);
  } catch (error) {
    console.error("Error retrieving assets:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/renameGroup", async (req, res) => {
  const { groupid, name } = req.body;
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

app.post("/invest", async (req, res) => {
  const { groupid } = req.body;
  try {
    const data = await pool.query(
      `
      SELECT year,phase FROM "session" WHERE sessionid = (SELECT sessionid FROM "group" WHERE groupid = $1);
    `,
      [groupid]
    );
    let { year, phase } = data.rows[0];
    const result = await pool.query(`
      SELECT assets.id,assets.asset_type,assets.asset_name,price_${year}.phase${phase}_price as asset_price,price_${year}.phase${phase}_diff as asset_diff FROM assets,price_${year} WHERE assets.id = price_${year}.asset_id ORDER BY assets.asset_type,assets.asset_name ASC
    `);
    const investment = await pool.query(`
      SELECT stockid,holdings FROM investment WHERE groupid = ${groupid} ORDER BY stockid ASC
    `);
    const holdings = {};
    investment.rows.forEach((e) => {
      holdings[e["stockid"]] = e["holdings"];
    });

    const assets = {};
    console.log(result.rows)
    result.rows.forEach((row) => {
      const { id, asset_type, asset_name, asset_price, asset_diff } = row;
      if (!assets.hasOwnProperty(`${asset_type}List`)) {
        assets[`${asset_type}List`] = [];
      }
      console.log(id,DATA.news[`${year}`][`${phase}`].assets);
      if(DATA.news[`${year}`][`${phase}`].assets.includes(id)){
        if (holdings[`${id}`] === undefined) {
          console.log(assets);
          assets[`${asset_type}List`].push({
            id: id,
            name: asset_name,
            price: asset_price,
            diff: asset_diff,
            holdings: 0,
            holdings_diff: 0,
          });
        } else {
          assets[`${asset_type}List`].push({
            id: id,
            name: asset_name,
            price: asset_price,
            diff: asset_diff,
            holdings: holdings[`${id}`],
            holdings_diff:
              Math.round(holdings[`${id}`] * (asset_diff / 100) * 100) / 100,
          });
        }
      }
    });

    // Sort assets swithin each type alphabetically
    Object.keys(assets).forEach((assetType) => {
      assets[assetType].sort((a, b) => a.name.localeCompare(b.name));
    });
    res.status(200).send(assets);
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
});

app.post("/trade", async (req, res) => {
  const { groupid, stockid } = req.body;
  try {
    let cash = await pool.query(`
    SELECT cash FROM "group" WHERE groupid = ${groupid} 
    `);
    let holding = await pool.query(`
    SELECT holdings FROM investment WHERE groupid = ${groupid} AND stockid = ${stockid} 
    `);
    cash = cash.rows[0]["cash"];
    holding.rowCount > 0
      ? (holding = holding.rows[0]["holdings"])
      : (holding = 0);
    res.status(200).send({ cash: cash, holding: holding });
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
});

async function yearlyUpdate(groupid, amount, stockid, OP) {
  try {
    let gamedata = await pool.query(`
      SELECT year,phase FROM "session" WHERE sessionid = (SELECT sessionid FROM "group" WHERE groupid = ${groupid});
    `);
    const { year, phase } = gamedata.rows[0];
    pool.query(`
    UPDATE "group" 
    SET _${year} = _${year} ${OP} (${amount} * price_${year}.phase${phase}_diff / 100) 
    FROM price_${year}
    WHERE groupid = ${groupid} 
    AND price_${year}.asset_id = ${stockid};
  `);
  } catch (err) {
    res
      .status(400)
      .send({
        status: false,
        err: err.message,
        msg: "Could not update yearly amount of the group",
      });
  }
}

app.put("/buy", async (req, res) => {
  const { groupid, stockid, amount } = req.body;
  try {
    await pool.query(`
      UPDATE "group" SET cash = cash - ${amount} WHERE groupid = ${groupid}
    `);
    const holdings = await pool.query(`
      SELECT holdings FROM investment WHERE groupid = ${groupid} AND stockid = ${stockid} 
    `);
    holdings.rowCount > 0
      ? await pool.query(`
      UPDATE investment SET holdings = holdings + ${amount} WHERE groupid = ${groupid} AND stockid = ${stockid}
    `)
      : await pool.query(`
      INSERT INTO investment(stockid,groupid,holdings) values(${stockid},${groupid},${amount})
    `);
    await yearlyUpdate(groupid, amount, stockid, "+");
    res.status(200).send({ status: true });
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
});

app.put("/sell", async (req, res) => {
  const { groupid, stockid, amount } = req.body;
  try {
    await pool.query(`
      UPDATE "group" SET cash = cash + ${amount} WHERE groupid = ${groupid}
    `);
    const holdings = await pool.query(`
      SELECT holdings FROM investment WHERE groupid = ${groupid} AND stockid = ${stockid} 
    `);
    holdings.rowCount > 0
      ? await pool.query(`
      UPDATE investment SET holdings = holdings - ${amount} WHERE groupid = ${groupid} AND stockid = ${stockid}
    `)
      : "";
    await yearlyUpdate(groupid, amount, stockid, "-");
    res.status(200).send({ status: true });
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
});

// {option:1} -> year
// {option:0} -> phase
app.put("/gamechange", async (req, res) => {
  const { sessionid, OP, option } = req.body;
  try {
    option
      ? await pool.query(`
        UPDATE "session" SET year = year ${OP} 1 WHERE sessionid = ${sessionid}
      `)
      : await pool.query(`
        UPDATE "session" SET phase = phase ${OP} 1 WHERE sessionid = ${sessionid}
      `);
    res.status(200).send({ status: true });
  } catch (err) {
    res.status(400).send({ status: false, err: err.message });
  }
});

// setInterval(() => {
//   wss.broadcast({ type: "time", message: "new news" });
// }, 5000);

server.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`);
});
