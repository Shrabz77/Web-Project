/********************************************************************************* 
 * ITE5315 – Project 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 * 
 * Name: ___________________ Student ID: _______________ Date: ____________________ 
 *********************************************************************************/

const express = require("express");
const cors = require("cors");
const { initialize } = require("./db"); 
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // For parsing JSON data

// Initialize the database with MongoDB URI from environment variables
initialize(process.env.MONGO_URI) // Updated to use process.env.MONGO_URI
    .then((Restaurant) => { // Restaurant is returned after successful initialization
        // Add a new restaurant
        app.post("/api/restaurants", async (req, res) => {
            try {
                const newRestaurant = new Restaurant(req.body);
                const result = await newRestaurant.save();
                res.status(201).json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create restaurant" });
            }
        });

        // Get all restaurants with optional pagination and borough filtering
        app.get("/api/restaurants", async (req, res) => {
            const { page = 1, perPage = 10, borough } = req.query;
            const query = borough ? { borough } : {};

            try {
                const restaurants = await Restaurant.find(query)
                    .sort({ restaurant_id: 1 })
                    .skip((page - 1) * perPage)
                    .limit(parseInt(perPage));
                res.json(restaurants);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch restaurants" });
            }
        });

        // Get a specific restaurant by ID
        app.get("/api/restaurants/:id", async (req, res) => {
            try {
                const restaurant = await Restaurant.findById(req.params.id);
                if (restaurant) {
                    res.json(restaurant);
                } else {
                    res.status(404).json({ error: "Restaurant not found" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch restaurant" });
            }
        });

        // Update a restaurant by ID
        app.put("/api/restaurants/:id", async (req, res) => {
            try {
                const result = await Restaurant.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).json({ error: "Restaurant not found" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update restaurant" });
            }
        });

        // Delete a restaurant by ID
        app.delete("/api/restaurants/:id", async (req, res) => {
            try {
                const result = await Restaurant.findByIdAndDelete(req.params.id);
                if (result) {
                    res.status(204).send(); // No content
                } else {
                    res.status(404).json({ error: "Restaurant not found" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete restaurant" });
            }
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
    });