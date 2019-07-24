import express from "express";
import expressEjsExtend from "express-ejs-extend";

/**
 * Config view engine for app
 */

let configViewEngine = (app) => {
    app.engine('ejs', expressEjsExtend);
    app.use(express.static('./src/public'))
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
}

module.exports = configViewEngine;
