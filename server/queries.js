const Pool = require("pg").Pool;

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
  try {
    await pool.query(
      "INSERT INTO session(sessionid,title,excelLink,players,groups) VALUES($1,$2,$3,$4,$5)",
      [id, title, "", 0, 0]
    );
    response.status(200).send({ status: true });
  } catch (error) {
    console.log("Error: " + error.message);
    response.status(500).send("Error");
  }
  console.log(request.body);
};

const addGroup = async (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const { name, limit, sessionid } = request.body;
  
  try {
    // Check if the limit is a valid integer
    if (!Number.isInteger(limit)) {
      throw new Error("Invalid limit. Please provide a valid integer value.");
    }

    await pool.query(
      'INSERT INTO "group"(groupid, name, _limit, networth, stocks, commodities, cash, mutual_funds, sessionid, players, star) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [id, name, limit, 0, 0, 0, 0, 0, sessionid, 0, 0]
    );

    // const group_count = await pool.query(
    //   "SELECT groups FROM session WHERE sessionid = $1",
    //   [sessionid]
    // );
    // const [num] = Object.values(group_count.rows[0]);
    // const new_count = Number.parseInt(num) + 1;

    // await pool.query(
    //   "UPDATE session SET groups = $1 WHERE sessionid = $2 RETURNING *",
    //   [new_count, sessionid]
    // );

    response.status(200).send({ status: true });
  } catch (error) {
    console.log(error);
    response.status(400).send("Error: " + error.message);
  }
};


const getSessions = async (request, response) => {
  console.log("Tried fetcing sessions");
  try {
    var sessions = await pool.query("SELECT * FROM session");
    const players = await pool.query(`SELECT "group".sessionid, SUM("group".players)
      FROM "group"
      JOIN "session" ON "session".sessionid = "group".sessionid
      GROUP BY "group".sessionid`
    );
    const groups = await pool.query(`select "group".sessionid,count(sessionid) from "group" group by "group".sessionid;`);
    sessions.rows.forEach(element => {
      element.players = '0';
      element.groups = '0';
      players.rows.forEach(player=>{
        if(element.sessionid==player.sessionid){
          element.players = player.sum;
        }
      });
      groups.rows.forEach(group=>{
        if(element.sessionid==group.sessionid){
          element.groups = group.count;
        }
      });
      console.log("sessions: ",sessions.rows);
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

const deleteGroup = async (request, response) => {
  const [groupid] = Object.values(request.body);
  try {
    await pool.query("DELETE FROM group WHERE groupid=$1", [groupid]);
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + err.message);
  }
};

const removeUser = async (request, response) => {
  const [userid] = Object.values(request.body);
  try {
    await pool.query("DELETE FROM users WHERE userid=$1", [userid]);
    response.status(200).send({ status: true });
  } catch (error) {
    response.status(400).send("Error: " + err.message);
  }
};

const alterRole = async (request, response) => {
  const {userid, role} = Object.values(request.body);
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
  const {name, mobile, password} = Object.values(request.body);
  var groupid = Number.parseInt(request.params.id);
  try {
    const user = await pool.query(
      "SELECT userid, name, password FROM users WHERE mobile=$1",
      [mobile]
    );
    if (user.rowCount == 0) {
      let id = Math.floor(100000 + Math.random() * 900000);
      
      try {
        let res = await pool.query(
          "INSERT INTO users (userid,name,mobile,password,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $6,$7)",
          [
            id,
            name,
            mobile,
            password,
            groupid,
            "",
            new Date(),
          ]
        );
        let player_count = await pool.query('select players from "group" where groupid=$1',[groupid]);
        await pool.query('update "group" set players=$1 where groupid=$2',[player_count+1,groupid]);

        response.status(200).send({ userid: id, star_count: 0 });
      } catch (error) {
        console.log("Error: "+error.message);
        response.status(400).send({ status: false });
      }
    } else {
      let [userid, db_name, db_password] = Object.values(
        user.rows[0]
      );
      try {
        const group = await pool.query('SELECT star FROM "group" WHERE groupid = $1',[groupid]);
        const [star_count] = Object.values(group.rows[0]);
        if (db_name == name && db_password == password) {
          response.send({ userid: userid, star_count: star_count });
        } else {
          response.status(401).send({status:false,invalid:true});
        }
      } catch (error) {
        console.log(
          "Error: " + error.message 
        )
      }
      
    }
  } catch (error) {
    console.log("error"+error.message)
  }
};

const getChart = async (request,response) =>{
  const groupid = request.params.id;
  // const ratio  = (numerator,base)=>{
  //   if(numerator!==0){
  //     return Number.parseInt(Math.round((numerator/base)*100));
  //   }
  //   return 0;
  // }
  try {
    const products = await pool.query('SELECT networth, stocks, commodities, cash, mutual_funds FROM "group" WHERE groupid = $1',[groupid]);
    const [networth,stocks,commodities,funds] = Object.values(products.rows[0]);
    response.status(200).send({networth:networth,stocks:stocks,commodities:commodities,mutual_funds:funds});
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

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
  getChart
};
