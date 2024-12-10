/********************************************************************************* 
 * ITE5315 – Project 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 * 
 * Name: ___________________ Student ID: _______________ Date: ____________________ 
 *********************************************************************************/


const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    borough: String,
    cuisine: String,
    restaurant_id: { type: String, required: true },
    address: {
        building: String,
        street: String,
        zipcode: String,
    },
    grades: [
        {
            date: Date,
            grade: String,
            score: Number,
        },
    ],
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

const initialize = (mongoURI) => {
    return mongoose.connect(mongoURI)
        .then(() => {
            console.log('MongoDB connected');
            return Restaurant; 
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        });
};

module.exports = { initialize };
