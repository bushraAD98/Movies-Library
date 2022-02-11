// 'use strict';
// const express = require('express');
// const pg = require("pg");
// const app = express();

// const axios = require('axios');
// const dotenv = require("dotenv");
// dotenv.config();
// const API_KEY = process.env.API_KEY;
// const PORT = process.env.PORT ||3001;

// app.use = (express.json());

'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const axios = require("axios");
const pg = require("pg");
// const { Client } = require('pg/lib');

const client = new Client ({
  connectionString : process.env.DATABASE_URL,
  ssl : { rejectUnauthorized : false}
  });
// const client = new pg.Client(process.env.DATABASE_URL);
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);
// const client = new pg.Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// });
app.use(express.json());
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;


app.get('/trending',trendingHandler);
app.get("/search", searchHandler);
// app.get('/favorite',favoriteHandler);

app.post("/addMovie" , addMovieHandler);
app.get("/getMovie",getFavHandler);
//task14 Endpoints:
app.put("/updateFavMovie/:id",updateFavMovie);
app.delete("/deleteFavMovie/:id",deleteFavMovie);
app.get("/getFavHandlerId/:id",getFavHandlerId);

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
  }
  

  
// app.use(errorNotfoundHandler);
// app.use(errorHandler);
  
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
console.log(data.rows);
return res.status(201).json(data.rows);
}) .catch((error) => {
  console.log(error);
  // errorHandler(error,req,res);

  });

}

function getFavHandler(req,res){
  // path : 
  const sql = `SELECT * FROM favMovies`;
 client.query(sql).then((data)=> {
  console.log(data);
return res.status(200).json(data.rows);

}).catch((error) => {
  errorHandler(error,req,res);
  });
 }

function updateFavMovie(req,res){
  // http:localhost:3000/updateFavMovie/:id

const id = req.params.id;
const movie = req.body;
const sql = `UPDATE favMovies set title=$1 , release_date=$2 ,poster_path=$3 , overview=$4 WHERE id=${id} RETURNING * ;` ;
const values = [movie.title , movie.release_date,movie.poster_path,movie.overview];
client.query(sql,values).then((data)=> {
return res.status(200).json(data.rows); 
}).catch((error)=> {
console.log(error);
});

}

function deleteFavMovie(req,res){
 // http:localhost:3000/deleteFavMovie/:id
 const id = req.params.id;
 const sql = `DELETE FROM favMovies WHERE id=${id} ;`;
 client.query(sql).then(()=> {
return res.status(204).json({});
 }).catch((error)=> {
console.log(error);
 });

}


function getFavHandlerId(req,res){
  // path : http://localhost:3000/getFavHandlerId/:id
  const id = req.params.id ;
  const sql = `SELECT * FROM favMovies WHERE id=${id} ;`;
 client.query(sql).then((data)=> {
  console.log(data);
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
