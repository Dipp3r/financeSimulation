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
  const [name, limit, sessionid] = Object.values(request.body);
  try {
    await pool.query(
      'INSERT INTO "group"(groupid,name,_limit,networth,stocks,commodities,cash,mutual_funds, sessionid,players,star) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
      [id, name, limit, 0, 0, 0, 0, 0, sessionid, 0, 0]
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
    response.status(200).send({ status: true });
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
  const [userid, role] = Object.values(request.body);
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
  var groupid = Number.parseInt(request.params.id);
  try {
    const user = await pool.query(
      "SELECT userid, name, password FROM users WHERE mobile=$1",
      [mobile]
    );
    if (user.rowCount == 0) {
      let id = Math.floor(100000 + Math.random() * 900000);
      try {
        await pool.query(
          "INSERT INTO users (userid,name,mobile,password,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $6,$7)",
          [
            id,
            name,
            mobile,
            password,
            groupid,
            "",
            new Date().toLocaleDateString(),
          ]
        );
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
          response.status(200).send({ userid: userid, star_count: star_count });
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
  const ratio  = (numerator,base)=>{
    if(numerator!==0){
      return Number.parseInt(Math.round((numerator/base)*100));
    }
    return 0;
  }
  try {
    const products = await pool.query('SELECT networth, stocks, commodities, cash, mutual_funds FROM "group" WHERE groupid = $1',[groupid]);
    const [networth,stocks,commodities,funds] = Object.values(products.rows[0]);
    response.status(200).send({networth:networth,stocks:ratio(stocks,commodities),commodities:ratio(commodities,networth),mutual_funds:ratio(funds,networth)});
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
