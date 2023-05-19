const { request } = require("express");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance",
  password: "arun",
  port: 5432,
});

// const pool = new Pool({
//   user: "vaaghu",
//   host: "localhost",
//   database: "finance",
//   password: "123456",
//   port: 5432,
// });

const test = async (req, res) => {
  try {
    const sessions = await pool.query('SELECT * FROM "group"');
    res.send(sessions.rows);
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
};

const addSession = async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const [title] = Object.values(request.body);
  try {
    await pool.query(
      "INSERT INTO session(sessionid,title,excelLink,players,groups) VALUES($1,$2,$3,$4,$5)",
      [id, title, "", 0, 0]
    );
    response.status(200).send("sucess");
  } catch (error) {
    console.log("Error: " + error.message);
    response.status(500).send("Error");
  }
  console.log(request.body);
};

const addGroup = async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const [name, limit, sessionid] = Object.values(request.body);
  try {
    await pool.query(
      'INSERT INTO "group"(groupid,name,_limit,networth,stocks,commodities,cash,mutual_funds, sessionid,players) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [id, name, limit, 0, 0, 0, 0, 0, sessionid, 0]
    );
    const group_count = await pool.query(
      "SELECT groups FROM session WHERE sessionid = $1",
      [sessionid]
    );
    const [num] = Object.values(group_count.rows[0]);
    const new_count = Number.parseInt(num) + 1;
    await pool.query(
      "UPDATE session SET groups = $1 WHERE sessionid = $2 RETURNING *",
      [new_count, sessionid]
    );
    response.status(200).send("sucess");
  } catch (error) {
    console.log(error);
    response.status(400).send("Error: " + err.message);
  }
};

const getSessions = async (request, response) => {
  try {
    await pool.query("SELECT * FROM session");
    response.send(result.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
};

const getGroups = async (request, response) => {
  const [sessionid] = Object.values(request.body);
  try {
    const groups = await pool.query(
      'SELECT groupid,name,players FROM "group" WHERE sessionid=$1',
      [sessionid]
    );
    response.send(groups.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
};

const getPlayers = async (request, response) => {
  const [groupid] = Object.values(request.body);
  try {
    const players = await pool.query(
      "SELECT userid,name,mobile,role from users WHERE groupid=$1",
      [groupid]
    );
    response.send(players.rows);
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
};


module.exports = {
  test,
  addSession,
  addGroup,
  getSessions,
  getGroups,
  getPlayers,
};
