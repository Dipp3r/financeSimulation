const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path')
const app = express()
const port = 3010;
const cookieTime = 1000*60*60*24*10

//middleware
// app.use('/',express.static(path.join(__dirname, "/public/build")));
// app.use('/admin',express.static(path.join(__dirname, "/admin/build")));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(sessions({
    secret:"thisIsASceret",
    saveUninitialized:true,
    cookie:{maxAge:cookieTime},
    resave:false
}))

function getRandomId(len){
    return Number.parseInt((new Array(len).fill(Math.round((Math.random()*10)))).join(""))
}


app.use('/admin', express.static(path.join(__dirname, 'admin/build')))
app.use(express.static(path.join(__dirname, 'public/build')))


app.get('admin/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/admin/build/index.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/build/index.html'));
});

let session;
app.listen(port,(err)=>{
    console.log(`server : http://localhost:${port}`)
    if (err) console.log(err)
})