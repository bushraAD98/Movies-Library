'use strict';
const express = require('express');
const pg = require("pg");
const app = express();
app.use = (express.json());
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT ||3001;
const client = new pg.Client(process.env.DATABASE_URL);



app.get('/trending',trendingHandler);
app.get("/search", searchHandler);
// app.get('/favorite',favoriteHandler);

app.post("/addMovie" , addMovieHandler);
app.get("/getMovie",getFavHandler);
app.get("/get",getFavHandler);

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
  }
  

  
// app.use(errorNotfoundHandler);
app.use(errorHandler);
  
  function trendingHandler(req,res){
    //req:  http://localhost:3000/trending
    //res https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US
    
    let allMovies = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`).then((value) => {
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
    .get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=1`).then((value) => {
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
      errorHandler(error,req,res);
      });
  }

  // function favoriteHandler(req,res){
  //   return res.status(200).send("Welcome to Favorite Page");
  // }


  
function errorHandler (error,req, res) {
  const err = 
  {
    status : 500 ,
    message : error
  }
  res.status(500).send(err);
  }

// function errorNotfoundHandler(req, res) {
//   res.status(404).send("there is no endpoint with this name");
// }








function addMovieHandler(req,res){
  let movie = req.body;
const sql = `INSERT INTO favMovies(title, release_date, poster_path, overview)values($1,$2,$3,$4)RETURNING * ;`
let values = [movie.title, movie.release_date,movie.poster_path, movie.overview];
client.query(sql,values).then((data) =>{

return res.status(201).json(data.rows);
}) .catch((error) => {
  errorHandler(error,req,res);
  });

}

function getFavHandler(req,res){
  const sql = `SELECT * FROM favMovies`;
  client.query(sql).then((data)=> {
return res.status(200).json(data.rows);
  }).catch((error) => {
    errorHandler(error,req,res);
    });
}

client.connect().then(()=>{
  app.listen (PORT, () => {
    console.log(`Listen to the port${PORT}`);
  
  });
});
