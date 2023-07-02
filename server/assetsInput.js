const express = require("express");
// const app = express();
const Pool = require("pg").Pool;
// const http = require("http");
// const server = http.createServer(app);
// const WebSocket = require("ws");



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

async function addAssets() {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      asset_name VARCHAR(255),
      asset_type VARCHAR(255)
    );
    `);
    await pool.query(`truncate table assets;`);

    const promises = [];

    for (let type in assets) {
      assets[type].forEach(asset => {
        const promise = pool.query(
          'INSERT INTO assets (asset_type, asset_name) VALUES ($1, $2)',
          [type, asset]
        );
        promises.push(promise);
      });
    }
    

    await pool.query(`
      create table if not exists gameData ( year integer  primary key, phase1 time,phase2 time,phase3 time,phase4 time)
    `)
    // Truncate the table to remove existing data
    await pool.query(`TRUNCATE TABLE gameData`);
    data.year.forEach(year=>{
      const promise = pool.query(`insert into gameData(year,phase1,phase2,phase3,phase4) values($1,$2,$2,$2,$2)`,[year,'00:00:10']);
      promises.push(promise);
    });


    await Promise.all(promises)
    .then(async ()=>{
      // await pool.end()
    })

    console.log('Assets inserted successfully');
  } catch (error) {
    pool.end();
    console.error('Error inserting assets:', error);
  }
}

async function addCreateSampleTables() {
  try {
   
    data.year.forEach(async e=>{
      const tableName = `price_${e}`;

      // Create the table if it doesn't exist
      await pool.query(`
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

      // Truncate the table to remove existing data
      await pool.query(`TRUNCATE TABLE ${tableName}`);

      console.log(`Table ${tableName} created and truncated`);
    });

    let assetsList = [];

    // Fetch the assets list from the assets table
    const { rows } = await pool.query('SELECT * FROM assets');
    assetsList = rows;

    for (let asset of assetsList) {
      let previousPhasePrice = 0;
      for (let e of data.year) {
        let tableNumber = 1;
        let tableName = `price_${e}`;
        let prices = Array(4).fill(0);
        let pricesDiff = Array(4).fill(0);
        let newPrice = 0;

        for (let index = 0; index < 4; index++) {
          newPrice = Math.ceil(Math.random() * 10) * 10;
          prices[index] = newPrice;
          pricesDiff[index] =
            tableNumber === 1 && previousPhasePrice === 0
              ? 0
              : Math.round(((newPrice / previousPhasePrice) - 1) * 100);
          previousPhasePrice = newPrice;
        }

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
  } finally {
    await pool.end();
  }
}

async function deleteAssetPriceTables() {
  try {
    data.year.forEach(async e=>{
      await pool.query(`
        DROP TABLE IF EXISTS price_${e};
      `);
    });
    await pool.query(`
      DROP TABLE IF EXISTS assets;
    `);
    await pool.query(`
      DROP TABLE IF EXISTS gameData;
    `);
    console.log('Asset price tables deleted successfully');
  } catch (error) {
    console.error('Error deleting asset price tables:', error);
  } finally {
    await pool.end();
  }
}


// addAssets();
addCreateSampleTables();
// deleteAssetPriceTables()
