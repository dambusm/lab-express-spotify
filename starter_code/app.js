'use strict'

const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node')
const credentials = require('./credentials.js')
const spotifyApi = new SpotifyWebApi({
  clientId: credentials.clientId,
  clientSecret: credentials.clientSecret
})
const morgan = require('morgan')
const fs = require('fs')

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token'])
    console.log('Spotify client credentials granted successfully')
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err)
  })

// Middleware
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined', { stream: accessLogStream }))

// Routes
app.get('/', (req, res, next) => {
  var scopes = ['user-read-private', 'user-read-email']


  var redirectUri = 'https://example.com/callback'


  var clientId = credentials.clientId


  var state = 'some-state-of-my-choice'

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  })

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state)

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  console.log('auth url:', authorizeURL)

  console.log('xxxxxxxxxx')
  nsole.log('Something went wrong!', err)
})

res.render('index')
});


app.post('/credentials', (req, res, next) => {
  console.log(body);
})

app.get('/artists', (req, res, next) => {
  console.log('Search term: ', req.query.searchTerm)
  spotifyApi.searchArtists(req.query.searchTerm)
    .then(data => {
      console.log(data.body.artists.items[0])

      res.render('artists', data)
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log(err)
    })
})

app.get('/albums/:artistId', (req, res) => {
  console.log('artist id:', req.params.artistId)

  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log('Artist albums', data.body)
      res.render('albums', data.body)
    },
    function (err) {
      console.error(err)
    }
  )
})

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function (data) {
      console.log(data.body)
      res.render('tracks', data.body)
    }, function (err) {
      console.log('Something went wrong!', err)
    })
})

// Start listening
app.listen(3000)
