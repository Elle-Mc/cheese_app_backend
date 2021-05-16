///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

  // Connection Events
mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const CheesesSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
  });
  
  const Cheeses = mongoose.model("Cheeses", CheesesSchema);  

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("Hi cheese app");
});

// Cheeses index route
app.get("/cheeses", async (req, res) => {
    try {
        //send all cheeses
        res.json(await Cheeses.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// create cheeses route
app.post("/cheeses", async (req, res) => {
    try {
        //send all cheeses
        res.json(await Cheeses.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//update cheese route
app.put("/cheeses/:id", async (req, res) => {
    try {
        //send all cheeses
        res.json(await Cheeses.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    }
    catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// delete cheese route
app.delete("/cheeses/:id", async (req, res) => {
    try {
        //send all cheese
        res.json(await Cheeses.findByIdAndDelete(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));