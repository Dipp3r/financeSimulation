const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "financesimulator",
  password: "prehsurath",
  port: 5432,
});

const getUser = (request, response) => {
  const [name,mobile,password] = Object.values(request.body);
  console.log(Object.values(request.body));
  // const name = "Rithwin";
  // const mobile = "9132314334";
  // const password = "Rithwin$123";
  pool.query(
    "SELECT userid,name,password,star_count FROM users WHERE mobile=$1",
    [mobile],
    (error, results) => {
      if (error) {
        throw error;
      }
      if(results.rowCount==0){
        let id = Math.floor(100000 + Math.random() * 900000);
        pool.query("INSERT INTO users (userid,name,mobile,password,star_count) VALUES ($1, $2, $3, $4, $5)",[id,name,mobile,password,0]);
        response.status(200).send({'status':true,'userid':id,'star_count':0});
      }
      else{
        let [userid,db_name,db_password,star_count] = Object.values(results.rows[0]);
        if(db_name==name && db_password==password){
          response.status(200).send({'userid':userid,'star_count':star_count});
        }
        else{
          response.status(200).send({'status':false})
        }
      }
    }
  );
};


module.exports = {
  getUser,
};
