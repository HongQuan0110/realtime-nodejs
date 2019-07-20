var express = require('express');
var app = express();

var port = 3000;
var host = "localhost";

app.get('', (req, res, next) => {
    res.end('<h1>Hello world</h1>');
})

app.listen(port, host, () => {
    console.log('Server listening on port: ', port);
})
