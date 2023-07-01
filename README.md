# FinanceSimulation
A Forum to practice trading and investing(no deposit needed) by yourself or join a game with other  like-minded investors and compete for the top rank. Practice with Vittae money to sharpen your knowledge of how the stock market  works. The Stock Market Simulator will help you gain confidence before risking your own money.

<h4>SESSION TABLE</h4>

```sql
CREATE TABLE public.session (
    sessionid INTEGER PRIMARY KEY,
    title VARCHAR(255),
    excellink VARCHAR(255),
    time_created TIMESTAMP
);
```
```sql
alter table "session" add column time_created timestamp;
alter table "session" add column year integer;
alter table "session" add column phase integer;
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
