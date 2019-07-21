// var express = require('express');
import express from "express";
let app = express();

let port = 3000;
let host = "localhost";

app.get('', (req, res, next) => {
    res.end('<h1>Hello world</h1>');
})

app.listen(port, host, () => {
    console.log('Server listening on port: ', port);
})
