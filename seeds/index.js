const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')
const path = require('path');
const parkModel = require('../models/parks');

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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await parkModel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const park = new parkModel({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await park.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
