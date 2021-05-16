'use strict'

//Variables globales
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//Cabeceras
app.use(cors());

//Importación rutas
const usuario_ruta = require("./src/rutas/usuario.rutas");
const encuesta_ruta = require('./src/rutas/encuesta.rutas');

//Middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Carga de rutas localhost:3000/api/ejemplo
app.use('/api', usuario_ruta, encuesta_ruta);


//Exportar
module.exports = app;