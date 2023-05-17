const { request } = require("express");

const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "finance",
//   password: "arun",
//   port: 5432,
// });

const pool = new Pool({
  user: "vaaghu",
  host: "localhost",
  database: "finance",
  password: "123456",
  port: 5432,
});

//assign grp-id based on the unique link
//FORMAT request.body = {"name":"Narayanan", "mobile":"0987654321","password":"yan#123"}
const getUser = async (request, response) => {
  const [name, mobile, password, link] = Object.values(request.body);
  // const name = "Rithwin";
  // const mobile = "9132314334";
  // const password = "Rithwin$123";
  //usedrid , name,_limit,link,sessionid
  pool.query(
    "SELECT userid,name,password,star_count FROM users WHERE mobile=$1",
    [mobile],
    (error, results) => {
      if (error) {
        console.log();
      }
      pool.query(
        "SELECT groupid from group WHERE link=$1",
        [link],
        (err, result) => {
            // if(err){
            //     response.status(400).send("Error: "+err.message); 
            // }
          var { groupid } = result.rows[0];
        }
      );

      if (results.rowCount == 0) {
        let id = Math.floor(100000 + Math.random() * 900000);
        pool.query(
          "INSERT INTO users (userid,name,mobile,password,star,groupid,role,created_on) VALUES ($1, $2, $3, $4, $5, $,$7,$8)",
          [id, name, mobile, password, 0, groupid,"Analyst",new Date().toLocaleDateString()]
        );
        response.status(200).send({ status: true, userid: id, star_count: 0 });
      } else {
        let [db_name, db_password, star_count] = Object.values(
          results.rows[0]
        );
        if (db_name == name && db_password == password) {
          response.status(200).send({ userid: userid, star_count: star_count });
        } else {
          response.status(401);
        }
      }
    }
  );
};

const getStarCount = (request, response) => {
  const [userid] = Object.values(request.body);
  pool.query(
    "SELECT star_count FROM users WHERE userid=$1",
    [userid],
    (error, results) => {
      if (error) {
        response.status(400).send("Error: " + error.message);
      }
      if (results.rowCount) {
        response.status(201).send(results.rows[0]);
      }
    }
  );
};

const addSession = (request, response) => {
  console.log(request.body);
  let id = Math.floor(100000 + Math.random() * 900000);
  const [title, link] = Object.values(request.body);
  pool.query(
    "INSERT INTO session(sessionid,title,excelLink) VALUES($1,$2,$3)",
    [id, title, link],
    (error, results) => {
      if (error) {
        console.log("Error: " + error.message);
        response.status(500).send("Error");
      }
      response.status(200).send("sucess");
    }
  );
};

const getSessions = (request, response) => {
  pool.query("SELECT * FROM session", (error, result) => {
    if (error) {
      response.status(400).send("Error: " + error.message);
    }
    response.send(result.rows);
  });
};

const getGroups = (request, response) => {
  const [sessionid] = Object.values(request.body);
  pool.query(
    "SELECT groupid,name,players,link FROM group WHERE sessionid=$1",
    [sessionid],
    (error, result) => {
      if (error) {
        response.status(400).send("Error: " + error.message);
      }
      response.send(result.rows);
    }
  );
};

const addGroup = (request, response) => {
  let id = Math.floor(100000 + Math.random() * 900000);
  const [name, limit, sessionid,link] = Object.values(request.body);
  pool.query(
    'INSERT INTO "group"(groupid,name,_limit,networth,stocks,commodities,cash,mutual_funds,link,sessionid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [id, name, limit,0,0,0,0,0,link,sessionid],
    (err, result) => {
      if (err) {
        response.status(400).send("Error: " + err.message);
      }
      response.status(200).send("sucess");
    }
  );
};

const getPlayers = (request, response) => {
  const [groupid] = Object.values(request.body);
  pool.query(
    "SELECT userid,name,mobile,role from users WHERE groupid=$1",
    [groupid],
    (error, result) => {
      if (error) {
        response.status(400).send("Error: " + error.message);
      }
      response.send(result.rows);
    }
  );
};

const alterRole = (request, response) => {
  const [userid, role] = Object.values(request.body);
  pool.query(
    "UPDATE users SET role = $1 WHERE userid = $2",
    [role, userid],
    (error, results) => {
      if (error) {
        response.status(400).send("Error: " + error.message);
      }
      response.status(200);
    }
  );
};

const removeUser = (request, response) => {
  const [userid] = Object.values(request.body);
  pool.query("DELETE FROM users WHERE userid=$1", [userid], (err, result) => {
    if (err) {
        response.status(400).send("Error: " + err.message);
    }
    result.status(200);
  });
};

const deleteGroup = (request, response) => {
  const [groupid] = Object.values(request.body);
  pool.query("DELETE FROM group WHERE groupid=$1", [groupid], (err, result) => {
    if (err) {
        response.status(400).send("Error: " + err.message);
    }
    response.status(200);
  });
};

module.exports = {
  getUser,
  getStarCount,
  getSessions,
  addSession,
  getGroups,
  getPlayers,
  alterRole,
  addGroup,
  removeUser,
  deleteGroup,
};
