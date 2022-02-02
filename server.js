'use strict';
const express = require('express');
const app = express();
app.get('/',homepageHandler);
app.get('/favorite',favoriteHandler);

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
  }
  
   const dotenv = require("dotenv");
   dotenv.config();
  const jsonData = require("./data.json");

  app.listen (3000 , () => {
    console.log("Listen to the port ",3000);

  });
  function homepageHandler(req,res){
    let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview);
    return res.status(200).json(movies);
  }

  function favoriteHandler(req,res){
    return res.status(200).send("Welcome to Favorite Page");
  }


  
function errorHandler( req, res) {
  res.status(500).send("sorry something went wrong")
  }

function errorNotfoundHandler(req, res) {
  res.status(404).send("there is no endpoint with this name");
}

