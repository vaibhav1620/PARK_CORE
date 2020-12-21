const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const parkModel = require('./models/parks');

mongoose.connect('mongodb://localhost:27017/park-core',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connection open");
});

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req,res){
    res.send('Hello from parkour');
})

app.get('/home', function(req,res){
    res.render('home.ejs')
})

app.get('/makepark', async function(req,res){
    const park = new parkModel({title: 'PEC University',location: 'sector 12 Chandigarh'});
    await park.save();
    res.send(park);
})

app.get('/parks', async function(req,res){
    const parks = await parkModel.find({});
    res.render('parks/index.ejs',{parks})
})

app.listen(9000,()=>{
    console.log("SERVING ON PORT 9000");
})
