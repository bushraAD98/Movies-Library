'use strict';
const express = require('express');
const app = express();
app.use = (express.json());
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

app.get('/trending',trendingHandler);
app.get("/search", searchHandler);
// app.get('/favorite',favoriteHandler);

// const API_KEY = process.env.API_KEY;

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
  }
  

  app.listen (3000 , () => {
    console.log("Listen to the port ",3000);
  
  });
  
app.use(errorNotfoundHandler);
app.use(errorHandler);
  
  function trendingHandler(req,res){
    //req:  http://localhost:3000/trending
    //res https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US
    
    let allMovies = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=d14ee06d6234a7ddeda4a4eb53ee6072&language=en-US`).then((value) => {
        value.data.results.forEach((element) => {
          let newMovie = new Movies(
            element.id,
            element.title,
            element.release_date,
            element.poster_path,
            element.overview
          );
          allMovies.push(newMovie);
        });
        return res.status(200).json(allMovies);
        
      }).catch((error) => {
        // errorHandler( req, res);
        console.log(error);
      });
  }
    
  

  function searchHandler(req, res) {
 //req:  http://localhost:3000/search

    let search = req.query.search;
    let allMovies = [];
  
    axios
    .get(`https://api.themoviedb.org/3/search/movie?api_key=d14ee06d6234a7ddeda4a4eb53ee6072&language=en-US&query=${search}&page=1`).then((value) => {
        value.data.results.forEach((movie) => {
          movie = new Movies (
            movie.title ,
            movie.poster_path,
            movie.overview
          );
          allMovies.push(movie);
        });
        return res.status(200).json(allMovies);
      })
      .catch((error) => {
      console.log(error);
      });
  }











  // function favoriteHandler(req,res){
  //   return res.status(200).send("Welcome to Favorite Page");
  // }


  
function errorHandler( req, res) {
  res.status(500).send("sorry something went wrong")
  }

function errorNotfoundHandler(req, res) {
  res.status(404).send("there is no endpoint with this name");
}

