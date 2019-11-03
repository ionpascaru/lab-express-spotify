require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });




// the routes go here:

app.get("/artists", (req, res, next) => {
  const data =  {
    artist: req.query.artist
  }
  
  spotifyApi
  .searchArtists(data.artist)
  .then(artist => {
    const data = {
      artists: artist.body.artists.items
    }
    console.log("The received data from the API: ", data.body);
    res.render('artists', data)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:artistID', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then(albums => {
      const data = {
        albums: albums.body.items
      }
      res.render('albums', data)
    })
    .catch(err => {
      console.log("Error while searching albums ocurred: ", err)
    })
})

app.get('/tracks/:artistID', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.artistID)
    .then(tracks => {
      const data = {
        tracks: tracks.body.items
      }
      res.render('tracks', data)
    })
    .catch(err => {
      console.log("Error while searching tracks ocurred: ", err)
    })
})

app.get("/", (req, res, next) => {
  res.render("index");
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
