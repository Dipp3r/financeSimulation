CREATE DATABASE finance;

CREATE TABLE "session"(
    sessionid SERIAL PRIMARY KEY,
    title VARCHAR(255),
    excelLink VARCHAR(255),
    players INT,
    groups INT
);

CREATE TABLE "group"(
    groupid SERIAL PRIMARY KEY,
    name VARCHAR(255),
    _limit INT,
    networth INT,
    stocks INT,
    commodities INT,
    cash INT,
    mutual_funds INT,
    sessionid INT,
    players INT,
    FOREIGN KEY (sessionid) REFERENCES "session"(sessionid)
); 

CREATE TABLE "users"(
    userid SERIAL PRIMARY KEY,
    name VARCHAR(255),
    mobile VARCHAR(255),
    password VARCHAR(255),
    star INT,
    groupid INT,
    FOREIGN KEY (groupid) REFERENCES "group"(groupid),
    role VARCHAR(255),
    created_on TIMESTAMP
);

CREATE TABLE "finance_products"(
    stockid SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type INT,  --stocks(0)/mutualfunds(1)/commodities(2)
    year VARCHAR(255),
    loss_gain VARCHAR(255),
    rate INT,
    loss_gain_amt INT,
    overall_amt INT,
    overall_rate INT,
    overall_loss_gain_amt INT
);

CREATE TABLE "decision"(
    decisionid SERIAL PRIMARY KEY,
    stockid INT,
    groupid INT,
    decision BOOLEAN,
    amt INT,
    made_at TIMESTAMP,
    FOREIGN KEY (stockid) REFERENCES "finance_products"(stockid),
    FOREIGN KEY (groupid) REFERENCES "group"(groupid)
);

