const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

mongoose.connect('mongodb://localhost:27017/park-core',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req,res){
    res.send('Hello from parkour');
})

app.get('/home', function(req,res){
    res.render('home.ejs')
})

app.listen(9000,()=>{
    console.log("SERVING ON PORT 9000");
})
