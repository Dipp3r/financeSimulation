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

//assign grp-id based on the unique link
//FORMAT request.body = {"name":"Narayanan", "mobile":"0987654321","password":"yan#123"}


const test = async (req,res)=>{
  const [sessionid] = Object.values(req.body);
  try {
    const group_count = await pool.query( 'SELECT groups FROM session WHERE sessionid = $1',[sessionid]);
    const [num] = Object.values(group_count.rows[0])
    const new_count = Number.parseInt(num)+1;
    const upd_session = await pool.query("UPDATE session SET groups = $1 WHERE sessionid = $2 RETURNING *",[new_count,sessionid]);
    res.send(upd_session.rows[0]);
  } catch (error) {
    res.sendStatus(500).send(error.message)
  }
};

module.exports = {
  test
};
