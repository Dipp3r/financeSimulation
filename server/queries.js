const Pool = require("pg").Pool;

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

//API for testing

const test = async (req, res) => {
  try {
    const sessions = await pool.query('SELECT * FROM "group"');
    res.send(sessions.rows);
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
};

//API(s) FOR ADMIN

const addSession = async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const [title] = Object.values(request.body);
  if(title.length > 0){
    try {
      await pool.query(
        "INSERT INTO session(sessionid,title,excelLink,time_created) VALUES($1,$2,$3,$4)",
        [id, title, "",new Date()]
      );
      response.status(200).send({ status: true });
    } catch (error) {
      console.log("Error: " + error.message);
      response.status(500).send("Error");
    }
  } else{
    response.status(200).send({status:true});
  }
};

const addGroup = async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const { name, limit, sessionid } = request.body;
  if(name.length>0){
    try {
      if (!Number.isInteger(limit)) {
        throw new Error("Invalid limit. Please provide a valid integer value.");
      }
      await pool.query(
        'INSERT INTO "group"(groupid, name, _limit, networth, stocks, commodities, cash, mutual_funds, sessionid, players, star,time_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [id, name, limit, 0, 0, 0, 0, 0, sessionid, 0, 0,new Date()]
      );
      response.status(200).send({ status: true });
    } catch (error) {
      console.log(error);
      response.status(400).send("Error: " + error.message);
    }
  }else{
    response.status(200).send({ status: true });
  }
};

const getSessions = async (request, response) => {
  try {
    var sessions = await pool.query("SELECT * FROM session ORDER BY time_created DESC");
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
};

const getGroups = async (request, response) => {
  const [sessionid] = Object.values(request.body);
  try {
    const groups = await pool.query(
      'SELECT groupid,name,players FROM "group" WHERE sessionid=$1 ORDER BY time_created DESC',
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

const deleteGroup = async (request, response) => {
  const [groupid] = Object.values(request.body);
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
        await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [
          groupid,
        ]);
      } catch (err) {
        response.status(400).send("Error: "+err.message);
      }
    } else {
      try {
        await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [groupid]);

      } catch (err) {
        response.status(400).send("Error: "+err.message);
      }
    }
    response.status(200).send({ status: true });
  } catch (err) {
    response.status(400).send("Error: " + err.message);
  }
};

const removeUser = async (request, response) => {
  const [userid] = Object.values(request.body);
  try {
    await pool.query(`
    UPDATE "group"
    SET players = players - 1
    WHERE groupid = (SELECT groupid FROM users WHERE userid = $1);
    `, [userid]);
    await pool.query("DELETE FROM users WHERE userid=$1", [userid]);
    
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + err.message);
  }
};

const alterRole = async (request, response) => {
  const { userid, role } = request.body;
  // if someOne in group already in executive role
  // role of that person -> accountant or null
  try {
    await pool.query("UPDATE users SET role = $1 WHERE userid = $2", [
      role,
      userid,
    ]);
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + error.message);
  }
};

//API(s) FOR PUBLIC

//assign grp-id based on the unique link
//FORMAT request.body = {"name":"Narayanan", "mobile":"0987654321","password":"yan#123"}

const addUser = async (request, response) => {
  const [name, mobile, password] = Object.values(request.body);
  console.log(name,mobile,password);
  var groupid = Number.parseInt(request.params.id);
  try {
    const user = await pool.query(
      "SELECT groupid FROM users WHERE mobile=$1",
      [mobile]
    );
    console.log(user.rowCount);
    if (user.rowCount == 0) {
      let id = Math.floor(100000 + Math.random() * 900000);
      try {
        console.log(name, mobile, password);
        let res = await pool.query(
          "INSERT INTO users (userid,name,mobile,password,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $6,$7)",
          [id, name, mobile, password, groupid, "", new Date()]
        );
        let player_count = await pool.query(
          'select players from "group" where groupid=$1',
          [groupid]
        );
        await pool.query('update "group" set players=$1 where groupid=$2', [
          player_count.rows[0].players + 1,
          groupid,
        ]);
        response.status(200).send({ userid: id, star_count: 0 });
      } catch (error) {
        console.log("Error: " + error.message);
        response.status(400).send({ status: false });
      }
    } else {
      let [id] = Object.values(user.rows[0]);
      console.log(id);
      (id==groupid)?response.status(400).send({status:false,msg:"You are already a registered user"}):response.status(400).send({status:false,msg:"You are not authorized to enter this group"});
    }
  } catch (error) {
    console.log("error" + error.message);
  }
};

const getChart = async (request, response) => {
  const groupid = request.params.id;
  // const ratio  = (numerator,base)=>{
  //   if(numerator!==0){
  //     return Number.parseInt(Math.round((numerator/base)*100));
  //   }
  //   return 0;
  // }
  try {
    const products = await pool.query(
      'SELECT networth, stocks, commodities, cash, mutual_funds FROM "group" WHERE groupid = $1',
      [groupid]
    );
    const [networth, stocks, commodities, funds] = Object.values(
      products.rows[0]
    );
    response
      .status(200)
      .send({
        networth: networth,
        stocks: stocks,
        commodities: commodities,
        mutual_funds: funds,
      });
  } catch (error) {
    console.log("Error: " + error.message);
  }
};

module.exports = {
  test,
  addSession,
  addGroup,
  getSessions,
  getGroups,
  getPlayers,
  deleteGroup,
  removeUser,
  alterRole,
  addUser,
  getChart,
};
