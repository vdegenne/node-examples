var express = require('express')
var compression = require('compression')
var http = require('spdy')

let app = express()

app.use(compression())

app.get('/give-me-json', (req, res) => {
    res.json({ message: 'here\'s the application/json you requested' });
})

app.get('/give-me-html', (req, res) => {
    res.send('here\'s the text/html you requested');
})



app.listen('3000', () => {
    console.log('running')
})

