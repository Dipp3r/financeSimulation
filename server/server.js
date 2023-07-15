const express = require("express");

const ExcelJS = require("exceljs");
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
const { group } = require("console");
const ASSET = require("./assetsName.json");
const { get } = require("https");

//INITIALIZING VITTAE COIN

const COINS = 500000;

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

let allYears = "";
DATA.year.forEach((e) => {
  allYears += `_${e}, `;
});
allYears = allYears.trim().replace(/,$/, "");

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

let timer_key = {},
  startTime = {},
  delay = {},
  remainingTime = {},
  holdingsUpt = {};

async function updateGame(phase = 1, year = 1, lastYear = 0, session, time) {
  const YEAR = await pool.query(`
    SELECT year FROM gamedata ORDER BY year ASC LIMIT 2
  `);
  const [trailYear, firstYear] = [YEAR.rows[0]["year"], YEAR.rows[1]["year"]];
  if (phase >= 5) {
    phase = 1;
    if (year === trailYear) {
      await pool.query(`
        DELETE FROM investment
      `);
      await pool.query(`
        UPDATE "group" SET cash = 0 WHERE sessionid = ${session}
      `);
    }
    year++;
  }
  holdingsUpt[`${session}`] ??= {};
  holdingsUpt[`${session}`][`${year}`] ??= {};
  let groups = await pool.query(`
    SELECT groupid FROM "group" WHERE sessionid = ${session}
  `);
  groups = groups.rows;
  const groupList = [];
  groups.forEach((e) => {
    groupList.push(e.groupid);
  });
  if (year <= lastYear) {
    try {
      const yearBegan = await pool.query(`
        SELECT _${year} as curr_year FROM "session" WHERE sessionid = ${session}
      `);
      const query = `SELECT phase${phase} FROM gamedata WHERE year = $1 ORDER BY year ASC`;
      const result = await pool.query(query, [year]);
      time ??= result.rows[0][`phase${phase}`];
      if (Object.keys(DATA.news[`${year}`][`${phase}`]["assets"]).length > 0) {
        const [hours, minutes, seconds] = time.split(":");
        const totalSeconds =
          Number.parseInt(hours) * 3600 +
          Number.parseInt(minutes) * 60 +
          Number.parseInt(seconds);
        if (yearBegan.rows[0]["curr_year"] === 0) {
          await pool.query(`
            UPDATE "group" set cash = cash + ${COINS} WHERE sessionid = ${session}
          `);
          await pool.query(`
            UPDATE "session" SET _${year} = 1 where sessionid = ${session}
          `);
          wss.broadcast({
            cash: COINS,
            msgType: "CashUpt",
            groupList: groupList,
          });
        }
        await pool.query(
          `
          UPDATE "session" SET year = $1, phase = $2 where sessionid = $3
        `,
          [year, phase, session]
        );
        if (!holdingsUpt[`${session}`][`${year}`][`${phase}`]) {
          await pool.query(`
          UPDATE investment SET prev_holdings = holdings WHERE groupid in (SELECT groupid FROM "group" WHERE sessionid=${session})
          `);
          await pool.query(`
          UPDATE investment SET holdings = t2.new_holdings FROM (
            SELECT i.stockid, i.groupid, i.holdings + (i.holdings * p.phase${phase}_diff / 100) AS new_holdings 
            FROM investment AS i
            JOIN price_${year} AS p ON i.stockid = p.asset_id
            WHERE i.groupid IN (SELECT groupid FROM "group" WHERE sessionid = ${session})) AS t2 
            WHERE investment.stockid = t2.stockid AND investment.groupid = t2.groupid
          `);
          await pool.query(`
            UPDATE investment SET profit = (profit + holdings - prev_holdings) WHERE groupid in (SELECT groupid FROM "group" WHERE sessionid=${session})
          `);
          let tempYear = year - 1;
          let previous_years = "";
          for (tempYear; tempYear >= trailYear; tempYear--) {
            previous_years += ` - "group"._${tempYear}`;
          }
          await pool.query(`
            UPDATE "group" 
            SET _${year} = t2.total_holdings ${previous_years} FROM (
              SELECT groupid, SUM(i.profit) AS total_holdings
              FROM investment AS i
              GROUP BY i.groupid
            ) AS t2
            WHERE "group".groupid = t2.groupid AND "group".groupid in (SELECT groupid FROM "group" WHERE sessionid=${session}) 
          `);
          holdingsUpt[`${session}`][`${year}`][`${phase}`] = true;
          console.log("holdings ran once for - ", year, phase, holdingsUpt);
        }
        console.log("year: ", year, " phase:", phase, " sec: ", totalSeconds);
        let obj = {};
        obj.msgType = "GameChg";
        obj.year = year;
        obj.phase = phase;
        obj.news =
          Object.keys(DATA.news[`${year}`][`${phase}`]["news"]).length > 0;
        obj.time = time;
        year === trailYear ? (obj.star = 0) : (obj.star = year - firstYear + 1);
        obj.groupList = groupList;
        wss.broadcast(obj);
        startTime[`${session}`] = new Date().getTime();
        delay[`${session}`] = Number.parseInt(totalSeconds) * 1000;
        timer_key[`${session}`] = setTimeout(() => {
          updateGame(phase + 1, year, lastYear, session);
        }, delay[`${session}`]);
      } else {
        updateGame(phase + 1, year, lastYear, session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    wss.broadcast({
      msgType: "EndGame",
      groupList: groupList,
      sessionid: session,
    });
  }
}

function secondsToHMS(seconds) {
  if (!seconds) {
    return;
  }
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  var HH = hours < 10 ? "0" + hours : hours;
  var MM = minutes < 10 ? "0" + minutes : minutes;
  var SS = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return HH + ":" + MM + ":" + SS;
}

app.post("/start", async (req, res) => {
  let { sessionid, time } = req.body;
  time ??= secondsToHMS(remainingTime[`${sessionid}`]);
  const gameStatus = await pool.query(`
    SELECT start,year,phase FROM "session" WHERE sessionid = ${sessionid}
  `);
  let start = gameStatus.rows[0]["start"];
  if (start == 0) {
    await pool.query(`
        UPDATE "session" SET start = 1 WHERE sessionid = ${sessionid}
      `);
    let result = await pool.query(
      "select year from gameData ORDER BY year ASC"
    );
    let lastYear = result.rows.pop().year;
    let [currentYear, currentPhase] = [
      gameStatus.rows[0]["year"],
      gameStatus.rows[0]["phase"],
    ];
    updateGame(currentPhase, currentYear, lastYear, sessionid, time);
    res.status(200).end();
  }
});

app.post("/pause", async (req, res) => {
  const { sessionid } = req.body;
  console.log("pause:", holdingsUpt);
  clearTimeout(timer_key[`${sessionid}`]);
  elapsedTime = new Date().getTime() - startTime[`${sessionid}`];
  remainingTime[`${sessionid}`] = Math.round(
    (delay[`${sessionid}`] - elapsedTime) / 1000
  );
  pool.query(`
    UPDATE "session" SET start = 0 WHERE sessionid = ${sessionid}
  `);
  console.log("paused");
  let groups = await pool.query(`
    SELECT groupid FROM "group" WHERE sessionid = ${sessionid}
  `);
  groups = groups.rows;
  const groupList = [];
  groups.forEach((e) => {
    groupList.push(e.groupid);
  });
  wss.broadcast({ msgType: "GamePause", groupList: groupList });
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
        `INSERT INTO session(sessionid,title,time_created,year,phase,start, ${allYears}) VALUES($1,$2,$3,$4,$5,$6,0,0,0,0,0,0,0,0,0)`,
        [id, title, new Date(), firstYear, 1]
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
  let id = Math.floor(100000 + Math.random() * 900000);
  const { name, limit, sessionid } = request.body;
  if (name.length > 0) {
    try {
      if (!Number.isInteger(limit)) {
        throw new Error("Invalid limit. Please provide a valid integer value.");
      }
      await pool.query(
        `INSERT INTO "group"(groupid, name, _limit, cash, sessionid, players, time_created, ${allYears}) VALUES($1, $2, $3, $4, $5, $6, $7, 0, 0, 0, 0, 0, 0, 0, 0)`,
        [id, name, limit, 0, sessionid, 0, new Date()]
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
    const result = {};
    result.groupList = groups.rows;
    const gameinfo = await pool.query(`
      SELECT year,phase,start FROM "session" WHERE sessionid = ${sessionid}
    `);
    result.year = gameinfo.rows[0]["year"];
    result.phase = gameinfo.rows[0]["phase"];
    result.start = gameinfo.rows[0]["start"];
    const time = await pool.query(`
      SELECT phase${result.phase} as time FROM gamedata WHERE year = ${result.year}
    `);
    result.time = time.rows[0]["time"];
    response.send(result);
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
      await pool.query(`
        DELETE FROM users WHERE groupid = ${groupid}
      `);
      await pool.query(`
        DELETE FROM investment WHERE groupid = ${groupid}
      `);
      await pool.query(`
        DELETE FROM transaction WHERE groupid = ${groupid}
      `);
      await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [groupid]);
    } else {
      await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [groupid]);
    }
    wss.broadcast({
      groupList: [groupid],
      msgType: "DeleteAction",
      reason:
        "This group was either removed by the admin or it's no longer active",
    });
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
    const info = await pool.query(
      `
      select name,groupid from users where userid = $1
    `,
      [userid]
    );
    await pool.query("DELETE FROM users WHERE userid=$1", [userid]);

    wss.broadcast({
      userid: userid,
      groupList: [info.rows[0].groupid],
      name: info.rows[0].name,
      msgType: "DeleteAction",
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
        SELECT userid,name,groupid FROM users WHERE groupid = (SELECT groupid FROM users WHERE userid = $1) AND role = '0'
      `,
        [userid]
      );
      if (exe.rowCount > 0) {
        await pool.query(`UPDATE users SET role = '' WHERE userid = $1`, [
          exe.rows[0]["userid"],
        ]);
        wss.broadcast({
          userid: exe.rows[0]["userid"],
          groupid: exe.rows[0]["groupid"],
          name: exe.rows[0]["name"],
          prev_role: "0",
          role: "",
          msgType: "RoleChg",
        });
      }
    }
    const info = await pool.query(
      `
      select groupid,name,role from users where userid = $1
    `,
      [userid]
    );
    await pool.query("UPDATE users SET role = $1 WHERE userid = $2", [
      role,
      userid,
    ]);
    wss.broadcast({
      userid: userid,
      groupid: info.rows[0]["groupid"],
      name: info.rows[0]["name"],
      prev_role: info.rows[0]["role"],
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
  try {
    const user = await pool.query("SELECT groupid FROM users WHERE mobile=$1", [
      mobile,
    ]);
    if (user.rowCount == 0) {
      let id = Math.floor(100000 + Math.random() * 900000);
      try {
        const _limit = await pool.query(
          'select _limit as limit,players from "group" where groupid=$1',
          [groupid]
        );
        const { limit, players } = _limit.rows[0];
        if (limit > players) {
          await pool.query(
            "INSERT INTO users (userid,name,mobile,password,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $6,$7)",
            [id, name, mobile, password, groupid, "", new Date()]
          );
          await pool.query(
            'update "group" set players = players + 1 where groupid=$1',
            [groupid]
          );
          wss.broadcast({
            userid: id,
            groupid: groupid,
            name: name,
            msgType: "NewUser",
          });
          response.status(200).send({ userid: id });
        } else {
          response
            .status(400)
            .send({ status: false, msg: "Group limit exceeded" });
        }
      } catch (error) {
        console.log("Error: " + error.message);
        response.status(400).send({ status: false });
      }
    } else {
      let [id] = Object.values(user.rows[0]);
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

app.post("/login/:id", async (req, res) => {
  const { mobile, password } = req.body;
  var groupid = Number.parseInt(req.params.id);
  try {
    let result = await pool.query(
      `
      SELECT password as db_password,groupid as db_groupid,userid,role FROM users WHERE mobile = $1
    `,
      [mobile]
    );
    if (result.rowCount > 0) {
      const { db_password, db_groupid, userid, role } = result.rows[0];
      if (db_groupid == groupid) {
        if (db_password == password) {
          res.send({ userid: userid, role: role });
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

app.get("/getNews", async (req, res) => {
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

function getRandomLightHexColorCode() {
  const letters = '89ABCDEF'; // Use higher values for R, G, and B components
  let colorCode = '';
  for (let i = 0; i < 6; i++) {
    colorCode += letters[Math.floor(Math.random() * letters.length)];
  }
  return colorCode;
}

app.get("/download/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const info = await pool.query(`
    SELECT title, year, phase FROM "session" WHERE sessionid = ${sessionId}
  `);
  const title = info.rows[0]["title"];
  const finalYear = info.rows[0]["year"];
  const finalPhase = info.rows[0]["phase"];
  const gamedata = await pool.query(`
    SELECT year FROM gamedata ORDER BY year ASC LIMIT 2
  `);
  let year = gamedata.rows[1]["year"];
  let tempYear = year;
  
  const groups = await pool.query(`
    SELECT name, groupid FROM "group" WHERE sessionid = ${sessionId}
  `);
  const workbook = new ExcelJS.Workbook();

  for (const group of groups.rows) {
    const worksheet = workbook.addWorksheet(`${group["name"]}`);

    worksheet.getCell("A1").value = "year/phase";
    worksheet.getCell("A1").fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFBDAF' }
    };
    
    worksheet.mergeCells("B1:D1");
    worksheet.getCell("B1").value = "OPEN PHASE";
    worksheet.getCell("B1").fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'CCFC8F' }
    };
   
    worksheet.mergeCells("E1:G1");
    worksheet.getCell("E1").value = "MARKET UPDATE";
    worksheet.getCell("E1").fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8FE8FC' }
    };

    worksheet.mergeCells("H1:J1");
    worksheet.getCell("H1").value = "BREAKING NEWS";
    worksheet.getCell("H1").fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8F92FC' }
    };

    worksheet.mergeCells("K1:M1");
    worksheet.getCell("K1").value = "SUPER BREAKING NEWS";
    worksheet.getCell("K1").fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FC8FB8' }
    };
    worksheet.spliceRows(2,2,["","asset","buy","sell","asset","buy","sell","asset","buy","sell","asset","buy","sell"])
    let rowStart = 3;
    
    for (year; year <= finalYear; year++) {
      let ASSETS = {};
      Object.values(ASSET).forEach(e=>{
        e.forEach(a=>{
          ASSETS[`${a}`] = [""];
        })
      });
      // let yearColLast = yearColStart;
      let phase = 1;
      for(phase;phase<=4;phase++){
        let data = {buy:[],sell:[]};
        let assets = [];
        const row = await pool.query(`
          SELECT t1.name, SUM(t1.amount), t1.status
          FROM (
            SELECT assets.asset_name AS name, transaction.amount, transaction.status
            FROM assets
            JOIN transaction ON assets.id = transaction.assetid
            WHERE year = ${year} AND phase = ${phase} AND groupid = ${group["groupid"]}
          ) AS t1
          GROUP BY t1.name, t1.status;
        `);
        row.rows.forEach(transaction=>{
          if(!assets.includes(transaction["name"])){
            assets.push(transaction["name"]);
          }
          if(transaction["status"]=="buy"){
            data.buy.push({name:transaction["name"],amount:transaction["sum"]});
          }else{
            data.sell.push({name:transaction["name"],amount:transaction["sum"]}); 
          }
        });
        Object.keys(ASSETS).forEach(stock=>{
          if(!assets.includes(stock)){
            ASSETS[`${stock}`] = [...ASSETS[`${stock}`],...[`${stock}`,0,0]];
          }
        })
        assets.forEach(asset=>{
          let sellAmt = 0, buyAmt = 0;
          data.buy.forEach(e=>{
            if(e["name"]==asset){
              buyAmt = e["amount"];
            }
          })
          data.sell.forEach(e=>{
            if(e["name"]==asset){
              sellAmt = e["amount"];
            }
          })
          ASSETS[`${asset}`] = [...ASSETS[`${asset}`],...[asset,buyAmt,sellAmt]];
        });
      }
      Object.keys(ASSETS).forEach(stock=>{
        worksheet.spliceRows(rowStart,2,ASSETS[`${stock}`])
        rowStart +=1
      });
    }
    const columnCount = worksheet.columns.length;
    for (let colNumber = 1; colNumber <= columnCount; colNumber++) {
      const column = worksheet.getColumn(colNumber);
      column.width = 25;
      column.height = 10; // Set desired width value
    }
    let yearColStart = 3;
    for (tempYear; tempYear <= finalYear; tempYear++) {
      worksheet.mergeCells(`A${yearColStart}:A${yearColStart + 14}`);
      worksheet.getCell(`A${yearColStart}`).value = `${tempYear}`;
      worksheet.getCell(`A${yearColStart}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: getRandomLightHexColorCode() }
      };
      yearColStart += 15;
    }
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
  }
  
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title}.xlsx`
  );

  workbook.xlsx
    .write(res)
    .then(() => {
      console.log("Excel file created successfully.");
      res.end();
    })
    .catch((err) => {
      console.log("Error creating Excel file:", err);
      res.status(500).send("Error creating Excel file");
    });
});


app.put("/renameAsset", async (req, res) => {
  const { assetId, new_name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE assets SET asset_name = $1 WHERE id = $2`,
      [new_name, assetId]
    );
    const asset = await pool.query(`
      SELECT asset_type as type FROM assets WHERE id = ${assetId}
    `);
    console.log({
      assetid: assetId,
      name: new_name,
      type: asset.rows[0]["type"],
      msgType: "AssetRename",
    });
    wss.broadcast({
      assetid: assetId,
      name: new_name,
      type: asset.rows[0]["type"],
      msgType: "AssetRename",
    });
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
    const groupList = [];
    groups.rows.forEach((e) => {
      groupList.push(e.groupid);
    });
    if (groups.rowCount === 0) {
      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionid]);
    } else {
      await pool.query(`
        DELETE FROM users WHERE groupid in (SELECT groupid FROM "group" WHERE sessionid = ${sessionid})
      `);
      await pool.query(`
        DELETE FROM investment WHERE groupid in (SELECT groupid FROM "group" WHERE sessionid = ${sessionid})
      `);
      await pool.query(`
        DELETE FROM transaction WHERE groupid in (SELECT groupid FROM "group" WHERE sessionid = ${sessionid})
      `);
      await pool.query(`
        DELETE FROM "group" WHERE sessionid = ${sessionid}
      `);

      await pool.query(`DELETE FROM session WHERE sessionid = $1`, [sessionid]);
    }
    wss.broadcast({
      groupList: groupList,
      msgType: "DeleteAction",
      reason:
        "This session is either removed by the admin or it's no longer active",
    });
    res.status(200).send({ status: true });
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

async function assetInfo(assets, groupid, OP) {
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
    SELECT stockid,holdings,profit FROM investment WHERE groupid = ${groupid} ORDER BY stockid ASC
  `);
  const holdings = {};
  const profit = {};
  investment.rows.forEach((e) => {
    holdings[e["stockid"]] = e["holdings"];
    profit[e["stockid"]] = e["profit"];
  });

  result.rows.forEach((row) => {
    const { id, asset_type, asset_name, asset_price, asset_diff } = row;
    if (!assets.hasOwnProperty(`${asset_type}List`)) {
      assets[`${asset_type}List`] = [];
    }
    if (eval(`DATA.news[${year}][${phase}].assets.includes(id) ${OP} true`)) {
      if (holdings[`${id}`] === undefined) {
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
          holdings_diff: Math.round(profit[`${id}`] * 100) / 100,
        });
      }
    }
  });
  // Sort assets within each type alphabetically
  Object.keys(assets).forEach((assetType) => {
    assets[assetType].sort((a, b) => a.name.localeCompare(b.name));
  });
}

app.post("/invest", async (req, res) => {
  const { groupid } = req.body;
  try {
    const assets = {};
    await assetInfo(assets, groupid, "&&");
    res.status(200).send(assets);
  } catch (err) {
    console.log("error", err);
    res.status(400).send({ status: false, msg: err.message });
  }
});

app.get("/portfolio/:id", async (request, response) => {
  const groupid = request.params.id;
  let networth = 0,
    overall = 0;
  const result = {};
  await assetInfo(result, groupid, "||");
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
      SELECT t1.asset_type, SUM(t2.profit) AS holding_diff
      FROM assets AS t1
      JOIN investment AS t2 ON t1.id = t2.stockid
      WHERE t2.groupid = ${groupid}
      GROUP BY t1.asset_type;
    `);
    if (products.length > 0) {
      products.forEach((e) => {
        result[e.asset_type] = Number.parseInt(e.value);
        networth = networth + Number.parseInt(e.value);
      });
    } else {
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
    if (holding_diff.rows.length > 0) {
      holding_diff.rows.forEach((e) => {
        result[e.asset_type + "_diff"] = Number.parseInt(e.holding_diff);
        overall += Number.parseInt(e.holding_diff);
      });
    }

    result["overall"] = overall;
    overall
      ? (result["overall_diff"] =
          Math.round((overall / networth) * 100 * 100) / 100)
      : (result["overall_diff"] = 0);

    let yearly = await pool.query(`
      SELECT _${year} from "group" where groupid = ${groupid}
    `);
    yearly = yearly.rows[0][`_${year}`];
    result["yearly"] = yearly;
    yearly
      ? (result["yearly_diff"] =
          Math.round((yearly / networth) * 100 * 100) / 100)
      : (result["yearly_diff"] = 0);

    response.status(200).send(result);
  } catch (error) {
    console.log("Error: " + error.message);
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
          INSERT INTO investment(stockid,groupid,holdings,profit) values(${stockid},${groupid},${amount},0)
        `);
    const gameInfo = await pool.query(`
      select year,phase from "session" where sessionid = (select sessionid from "group" where groupid = ${groupid})
    `);
    const year = gameInfo.rows[0]["year"];
    const phase = gameInfo.rows[0]["phase"];
    await pool.query(
      `
      INSERT INTO transaction(assetid,groupid,amount,status,time,year,phase) VALUES(${stockid},${groupid},${amount},'buy',$1,${year},${phase})
    `,
      [new Date()]
    );
    wss.broadcast({ groupid: groupid, msgType: "Transact" });
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
    const gameInfo = await pool.query(`
      select year,phase from "session" where sessionid = (select sessionid from "group" where groupid = ${groupid})
    `);
    const year = gameInfo.rows[0]["year"];
    const phase = gameInfo.rows[0]["phase"];
    await pool.query(
      `
      INSERT INTO transaction(assetid,groupid,amount,status,time,year,phase) VALUES(${stockid},${groupid},${amount},'sell',$1,${year},${phase})
    `,
      [new Date()]
    );
    wss.broadcast({ groupid: groupid, msgType: "Transact" });
    res.status(200).send({ status: true });
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
});

// {option:1} -> year
// {option:0} -> phase
app.put("/gamechange", async (req, res) => {
  const { sessionid, OP, option } = req.body;
  remainingTime[`${sessionid}`] = undefined;
  try {
    const years = await pool.query(`
      SELECT year FROM gamedata ORDER BY year ASC
    `);
    const [trailYear, firstYear, lastYear] = [
      years.rows[0]["year"],
      years.rows[1]["year"],
      years.rows.pop()["year"],
    ];
    const info = await pool.query(`
          SELECT year, phase FROM  "session" WHERE sessionid = ${sessionid}
      `);
    let year = info.rows[0].year;
    let phase = info.rows[0].phase;
    await game(sessionid, OP, option, year, phase);
    async function game(sessionid, OP, option, year, phase) {
      if (option == "1") {
        if (
          !(
            (OP == "+" && year == lastYear) ||
            (OP == "-" && [trailYear].includes(year))
          )
        ) {
          if (OP == "-") {
            if (year == firstYear) {
              const trailStarted = await pool.query(`
                SELECT _${
                  year - 1
                } as deposited from "session" WHERE sessionid = ${sessionid}
              `);
              if (trailStarted.rows[0]["deposited"] == 0) {
                const deposited = await pool.query(`
                  SELECT _${year} as deposited from "session" WHERE sessionid = ${sessionid}
                `);
                if (deposited.rows[0]["deposited"] == 1) {
                  await pool.query(`
                    UPDATE "group" SET cash = cash - ${COINS} WHERE sessionid = ${sessionid}
                  `);
                  await pool.query(`
                    UPDATE "session" SET _${year} = 0 WHERE sessionid = ${sessionid}
                  `);
                }
                await pool.query(`
                  UPDATE "session" SET year = year ${OP} 1, phase = 1 WHERE sessionid = ${sessionid}
                `);
                year = eval(`${year} ${OP} 1`);
                phase = 1;
              }
            } else {
              const deposited = await pool.query(`
                SELECT _${year} as deposited from "session" WHERE sessionid = ${sessionid}
              `);
              if (deposited.rows[0]["deposited"] == 1) {
                await pool.query(`
                  UPDATE "group" SET cash = cash - ${COINS} WHERE sessionid = ${sessionid}
                `);
                await pool.query(`
                  UPDATE "session" SET _${year} = 0 WHERE sessionid = ${sessionid}
                `);
              }
              await pool.query(`
                UPDATE "session" SET year = year ${OP} 1, phase = 1 WHERE sessionid = ${sessionid}
              `);
              year = eval(`${year} ${OP} 1`);
              phase = 1;
            }
          } else {
            await pool.query(`
              UPDATE "session" SET year = year ${OP} 1, phase = 1 WHERE sessionid = ${sessionid}
            `);
            year = eval(`${year} ${OP} 1`);
            phase = 1;
          }
        }
      } else {
        if (phase > 3 && OP === "+") {
          console.log("running");
          if (year != lastYear) {
            if (year == trailYear) {
              console.log("trail running");
              const trailCash = await pool.query(`
                SELECT _${trailYear} AS cash FROM "session" WHERE sessionid = ${sessionid}
              `);
              if (trailCash.rows[0][`cash`] == 1) {
                console.log("trail cash removing");
                await pool.query(`
                  UPDATE "group" SET cash = cash - ${COINS} WHERE sessionid = ${sessionid}
                `);
              }
            }
            await pool.query(`
              UPDATE "session" SET phase = 1, year = year + 1 WHERE sessionid = ${sessionid}
            `);
            year = eval(`${year} ${OP} 1`);
            phase = 1;
          }
        } else if (phase < 2 && OP === "-") {
          if (![trailYear].includes(year)) {
            if (year == firstYear) {
              const trailStarted = await pool.query(`
                SELECT _${
                  year - 1
                } as deposited from "session" WHERE sessionid = ${sessionid}
              `);
              if (trailStarted.rows[0]["deposited"] == 0) {
                await pool.query(`
                  UPDATE "session" SET phase = 4, year = year - 1 WHERE sessionid = ${sessionid}
                `);
                const deposited = await pool.query(`
                  SELECT _${year} as deposited from "session" WHERE sessionid = ${sessionid}
                `);
                if (deposited.rows[0]["deposited"] == 1) {
                  await pool.query(`
                  UPDATE "group" SET cash = cash - ${COINS} WHERE sessionid = ${sessionid}
                `);
                  await pool.query(`
                  UPDATE "session" SET _${year} = 0 WHERE sessionid = ${sessionid}
                `);
                }
                year = eval(`${year} ${OP} 1`);
                phase = 4;
              }
            } else {
              console.log("running", year);
              await pool.query(`
                UPDATE "session" SET phase = 4, year = year - 1 WHERE sessionid = ${sessionid}
              `);
              const deposited = await pool.query(`
                SELECT _${year} as deposited from "session" WHERE sessionid = ${sessionid}
              `);
              if (deposited.rows[0]["deposited"] == 1) {
                await pool.query(`
                  UPDATE "group" SET cash = cash - ${COINS} WHERE sessionid = ${sessionid}
                `);
                console.log("deposited amount reduce");
                await pool.query(
                  `UPDATE "session" SET _${year} = 0 WHERE sessionid = ${sessionid}`
                );
                console.log("session updated");
              }
              year = eval(`${year} ${OP} 1`);
              phase = 4;
            }
          }
        } else {
          if (!(phase === 2 && year === lastYear && OP === "+")) {
            await pool.query(`
              UPDATE "session" SET phase = phase ${OP} 1 WHERE sessionid = ${sessionid}
            `);
            phase = eval(`${phase} ${OP} 1`);
          }
        }
      }

      if (
        Object.keys(DATA.news[`${year}`][`${phase}`]["assets"]).length <= 0 &&
        year != lastYear &&
        phase !== 2
      ) {
        await game(sessionid, OP, option, year, phase);
      }
    }
    const result = {};
    const gameinfo = await pool.query(`
      SELECT year,phase FROM "session" WHERE sessionid = ${sessionid}
    `);
    result.year = gameinfo.rows[0]["year"];
    result.phase = gameinfo.rows[0]["phase"];
    const time = await pool.query(`
      SELECT phase${result.phase} as time FROM gamedata WHERE year = ${result.year}
    `);
    result.time = time.rows[0]["time"];
    wss.broadcast({ ...result, sessionid: sessionid, msgType: "AdminGameChg" });
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ status: false, err: err.message });
  }
});

app.post("/news", async (req, res) => {
  const { year, phase } = req.body;
  try {
    const stocks = await pool.query(`
      SELECT id,asset_name FROM assets
    `);
    const assets = {};
    stocks.rows.forEach((e) => {
      assets[`${e.id}`] = e.asset_name;
    });
    const news = [];
    const obj = DATA.news[`${year}`][`${phase}`].news;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key].forEach((element) => {
          news.push(element.replace(/_asset_/g, `<b>${assets[`${key}`]}</b>`));
        });
      }
    }
    res.status(200).send({ news: news });
  } catch (err) {
    res.status(400).send({ status: false, err: err.message });
  }
});

app.post("/end", async (req, res) => {
  const { sessionid } = req.body;
  try {
    const groups = await pool.query(`
      SELECT groupid FROM "group" WHERE sessionid = ${sessionid}
    `);
    const groupList = [];
    groups.rows.forEach((e) => {
      groupList.push(e.groupid);
    });
    wss.broadcast({ msgType: "EndGame", groupList: groupList, sessionid:sessionid });
    res.status(200).send({
      status: true,
    });
  } catch (err) {
    res.status(400).send({
      status: false,
      msg: err.message,
    });
  }
});

app.post("/assetInfo",async (req,res)=>{
  const {assetid} = req.body;
  try {
    const info = await pool.query(`
      SELECT info FROM assets WHERE id = ${assetid}
    `); 
    res.status(200).send(info.rows[0]);
  } catch (err) {
    res.status(400).send({status:false, msg:err.message})
  }
})

app.put("/updateInfo",async (req,res)=>{
  const {assetid, text} = req.body;
  try {
    await pool.query(`
      UPDATE assets SET info = '${text}' WHERE id = ${assetid}
    `); 
    res.status(200).send({status:true});
  } catch (err) {
    res.status(400).send({status:false, msg:err.message})
  }
})

server.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`);
});
