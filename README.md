# FinanceSimulation
A Forum to practice trading and investing(no deposit needed) by yourself or join a game with other  like-minded investors and compete for the top rank. Practice with Vittae money to sharpen your knowledge of how the stock market  works. The Stock Market Simulator will help you gain confidence before risking your own money.

<h4>SESSION TABLE</h4>

```sql
CREATE TABLE "session" (
    sessionid INTEGER PRIMARY KEY,
    title VARCHAR(255),
    excellink VARCHAR(255),
    time_created TIMESTAMP,
    year INTEGER,
    phase INTEGER
);
```
```sql
alter table "session" add column time_created timestamp;
alter table "session" add column year integer;
alter table "session" add column phase integer;
alter table "session" add column start INTEGER;
```
<h4>GROUP TABLE</h4>

```sql
CREATE TABLE "group" (
    groupid INTEGER PRIMARY KEY,
    name VARCHAR(255),
    _limit INTEGER,
    networth INTEGER,
    stocks INTEGER,
    commodities INTEGER,
    cash INTEGER,
    star INTEGER,
    mutual_funds INTEGER,
    sessionid INTEGER,
    players INTEGER,
    time_created TIMESTAMP,
    CONSTRAINT group_sessionid_fkey FOREIGN KEY (sessionid) REFERENCES "session"(sessionid)
);
```
```sql
alter table "group" add column time_created timestamp;
```
<h4>INVESTMENT TABLE</h4>

```sql
CREATE TABLE investment (
    Id SERIAL PRIMARY KEY,
    stockid INTEGER,
    groupid INTEGER,
    holdings INTEGER,
    FOREIGN KEY (groupid) REFERENCES "group" (groupid),
    FOREIGN KEY (stockid) REFERENCES assets (id)
);
```
<h4>TRANSACTION TABLE</h4>

```sql
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    assetid INTEGER, 
    groupid INTEGER, 
    amount INTEGER, 
    status VARCHAR(255),
    time TIMESTAMP WITHOUT TIME ZONE, 
    CONSTRAINT transaction_assetid_fkey FOREIGN KEY(assetid) REFERENCES assets(id),
    CONSTRAINT transaction_groupid_fkey FOREIGN KEY(groupid) REFERENCES "group"(groupid)
);
```
WEB Sockets message types:
```python
msgType:  {
    "GameChg" : {
        year,
        phase,
        time,
        groupList
    },
    “RoleChg” : {
        userid,
        groupid,
        name,
        prev_role,
        role
    },
     “NewUser” : {
        userid,
        groupid,
        name
    },
    ”DeleteAction” : {
        userid|groupList,
        groupid | ,
        name | ,
        reason |  
    },
    ”GamePause” : {
        groupList
    }
    "CashUpt" : {
        cash
    },
    "Transact" : {
        groupid
    },
    "AssetRename" : {
        assetid,
        name,
        type
    },
    "EndGame" : {
        groupList
    },
    "AdminGameChg" : {
        time,
        phase,
        year,
        sessionid
    }
}
```
