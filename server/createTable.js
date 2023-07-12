const Pool = require("pg").Pool;

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

const assets  = require("./assetsName.json");
const data = require("./info.json");

let groupString = "", sessionString = "";
data.year.forEach(e=>{
  groupString += `_${e} FLOAT, `;
  sessionString += `_${e} INTEGER, `;
});
groupString = groupString.trim().replace(/,$/, '');
sessionString = sessionString.trim().replace(/,$/, '');


async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        sessionid INTEGER PRIMARY KEY,
        title VARCHAR(255),
        excellink VARCHAR(255),
        time_created TIMESTAMP WITHOUT TIME ZONE,
        year INTEGER,
        phase INTEGER,
        start INTEGER,
        ${sessionString}
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "group" (
        groupid INTEGER PRIMARY KEY,
        name VARCHAR(255),
        _limit INTEGER,
        cash INTEGER,
        sessionid INTEGER,
        players INTEGER,
        time_created TIMESTAMP WITHOUT TIME ZONE,
        ${groupString},
        CONSTRAINT group_sessionid_fkey FOREIGN KEY (sessionid) REFERENCES "session" (sessionid)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY,
        name VARCHAR(255),
        mobile VARCHAR(255),
        password VARCHAR(255),
        groupid INTEGER,
        role VARCHAR(255),
        created_on TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT users_groupid_fkey FOREIGN KEY (groupid) REFERENCES "group" (groupid)
      )
    `);
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      asset_name VARCHAR(255),
      asset_type VARCHAR(255)
    );
    `);

    await pool.query(`truncate table assets;`);

    const promises = [];
    let index = 1;
    for (let type in assets) {
      const assetArray = assets[type];
      for (let i = 0; i < assetArray.length; i++) {
        const asset = assetArray[i];
        const promise = pool.query(
          'INSERT INTO assets (id,asset_type, asset_name) VALUES ($1, $2, $3)',
          [index,type, asset]
        );
        index++;
        promises.push(promise);
      }
    }
    
 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gameData (
        year INTEGER PRIMARY KEY,
        phase1 TIME,
        phase2 TIME,
        phase3 TIME,
        phase4 TIME
      )
    `)
    // Truncate the table to remove existing data
    await pool.query(`TRUNCATE TABLE gameData`);
    data.year.forEach(year=>{
      const promise = pool.query(`insert into gameData(year,phase1,phase2,phase3,phase4) values($1,$2,$2,$2,$2)`,[year,'00:00:10']);
      promises.push(promise);
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS investment (
        id SERIAL PRIMARY KEY,
        stockid INTEGER,
        groupid INTEGER,
        holdings FLOAT,
        prev_holdings FLOAT,
        profit FLOAT,
        CONSTRAINT investment_groupid_fkey FOREIGN KEY (groupid) REFERENCES "group"(groupid),
        CONSTRAINT investment_stockid_fkey FOREIGN KEY (stockid) REFERENCES assets(id)
      )
    `);

    data.year.forEach(async e=>{
      const tableName = `price_${e}`;

      // Create the table if it doesn't exist
      let promise = await pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          asset_id INT,
          phase1_price FLOAT,
          phase1_diff FLOAT,
          phase2_price FLOAT,
          phase2_diff FLOAT,
          phase3_price FLOAT,
          phase3_diff FLOAT,
          phase4_price FLOAT,
          phase4_diff FLOAT
        );
      `);
      promises.push(promise);
      // Truncate the table to remove existing data
      await pool.query(`TRUNCATE TABLE ${tableName}`);
      console.log(`Table ${tableName} created and truncated`);
    });

    await pool.query(`
      CREATE TABLE transaction (
        id SERIAL PRIMARY KEY,
        assetid INTEGER, 
        groupid INTEGER, 
        amount INTEGER, 
        status VARCHAR(255),
        time TIMESTAMP WITHOUT TIME ZONE, 
        year INTEGER,
        phase INTEGER,
        CONSTRAINT transaction_assetid_fkey FOREIGN KEY(assetid) REFERENCES assets(id),
        CONSTRAINT transaction_groupid_fkey FOREIGN KEY(groupid) REFERENCES "group"(groupid)
      )`);   

    await Promise.all(promises);
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  }
}

async function addSamples() {
  try { 
    let  priceData = require("./price.json");
    const data = require("./info.json");
    let assetsList = [];

    // Fetch the assets list from the assets table
    const { rows } = await pool.query('SELECT * FROM assets');
    assetsList = rows;
    for (let asset of assetsList) {
      let previousPhasePrice = 0;
      for (let year of data.year) {
        let tableNumber = 1;
        let tableName = `price_${year}`;
        let prices = Array(4).fill(0);
        let pricesDiff = Array(4).fill(0);
        let newPrice = 0;

        for (let phase = 0; phase < 4; phase++) {
          newPrice = priceData[year][`${phase+1}`]?priceData[year][`${phase+1}`][asset.id]:previousPhasePrice;
          prices[phase] = newPrice;
          pricesDiff[phase] =
            tableNumber === 1 && previousPhasePrice === 0
              ? 0
              : Math.round(((newPrice / previousPhasePrice) - 1) * 100);
          if(year == "2100" && phase == 0) pricesDiff[phase] = 0
          previousPhasePrice = newPrice;
        }
        // console.log(year,asset.id,prices,pricesDiff)
        await pool.query(
          `INSERT INTO ${tableName} (asset_id, phase1_price, phase1_diff, phase2_price, phase2_diff, phase3_price, phase3_diff, phase4_price, phase4_diff)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            asset.id,
            prices[0],
            pricesDiff[0],
            prices[1],
            pricesDiff[1],
            prices[2],
            pricesDiff[2],
            prices[3],
            pricesDiff[3]
          ]
        );

        console.log(
          `Data inserted for asset ID ${asset.id} into ${tableName}`
        );
        tableNumber++;
      };
    }

    console.log('Sample tables and data created successfully');
  } catch (error) {
    console.error('Error creating sample tables and data:', error);
  }
}

async function deleteTables() {
  try {
    for (const e of data.year) {
      await pool.query(`
        DROP TABLE IF EXISTS price_${e};
      `);
    }

    await pool.query(`
      DROP TABLE IF EXISTS investment;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS transaction;
    `);

    // Drop parent tables next
    await pool.query(`
      DROP TABLE IF EXISTS assets;
    `);

    // Drop remaining tables
    await pool.query(`
      DROP TABLE IF EXISTS gameData;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS users;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS "group";
    `);

    await pool.query(`
      DROP TABLE IF EXISTS "session";
    `);

    console.log('All tables deleted successfully');
  } catch (error) {
    console.error('Error deleting tables:', error);
  }
}

// for (const e of data.year) {
//   pool.query(`
//     truncate TABLE price_${e};
//   `);
// }
// deleteTables();
// createTables();
// addSamples();