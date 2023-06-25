CREATE DATABASE finance;

CREATE TABLE "session"(
    sessionid SERIAL PRIMARY KEY,
    title VARCHAR(255),
    excelLink VARCHAR(255)
);

CREATE TABLE "group"(
    groupid SERIAL PRIMARY KEY,
    name VARCHAR(255),
    _limit INT,
    networth INT,
    stocks INT,
    commodities INT,
    cash INT,
    star INT,
    mutual_funds INT,
    sessionid INT,
    players INT,
    FOREIGN KEY (sessionid) REFERENCES "session"(sessionid)
); 

CREATE TABLE "users"(
    userid serial primary key,
    name varchar(255),
    mobile varchar(255),
    password varchar(255),
    groupid int,
    foreign key (groupid) references "group"(groupid),
    role varchar(255),
    created_on timestamp
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

