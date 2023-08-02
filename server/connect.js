const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "dbmasteruser",
//   host: "ls-0121e97b6fd6b13da8ea3fea1be90009aa8f24c8.cd6sa4pnf9xj.ap-south-1.rds.amazonaws.com",
//   database: "vittae-game",
//   password: ">}5|]|BP}TyB,uuus(Rk>~!~=pXp)nHw",
//   port: 5432,
// });

// const pool = new Pool({
//   user: "vittaex",
//   host: "localhost",
//   database: "finance",
//   password: "123456",
//   port: 5432,
// });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance",
  password: "arun",
  port: 5432,
});

module.exports = pool;
