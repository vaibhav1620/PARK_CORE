const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require("morgan");
const methodOverride = require('method-override');
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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

app.get('/parks/new', function(req,res){
    res.render('parks/new.ejs')
})

app.get('/parks/:id', async function(req,res){
    const id = req.params.id;
    const park = await parkModel.findById(id);
    res.render('parks/show.ejs',{ park });
})

app.get('/parks/:id/edit', async function(req,res){
    const id = req.params.id;
    const park = await parkModel.findById(id);
    res.render('parks/edit.ejs',{ park });
})

app.post('/parks',async function(req,res){
    const new_park =  new parkModel(req.body.park);
    await new_park.save();
    res.redirect('/parks/'+new_park._id);
})

app.put('/parks/:id',async function(req,res){
    const id = req.params.id;
    edit_park = await parkModel.findByIdAndUpdate(id,{title: req.body.park.title, location: req.body.park.location});
    res.redirect('/parks/'+edit_park._id);
})

app.delete('/parks/:id', async function(req ,res){
    const id = req.params.id;
    await parkModel.findByIdAndDelete(id);
    res.redirect('/parks');
})

app.listen(9000,()=>{
    console.log("SERVING ON PORT 9000");
})
