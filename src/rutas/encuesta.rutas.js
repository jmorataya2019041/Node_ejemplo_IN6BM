'use strict'

const express = require('express');
const encuestacontrolador = require('../controladores/encuesta.controlador');

//Importar el middleware
const md_autenticacion = require('../middlewares/authenticated');

const api = express.Router();
api.post('/crearEncuesta', md_autenticacion.ensureAuth, encuestacontrolador.crearEncuesta);
api.get('/obtenerEncuestas', md_autenticacion.ensureAuth, encuestacontrolador.encontrarEncuestas)
api.put('/agregarComentario/:idEncuesta',md_autenticacion.ensureAuth,encuestacontrolador.agregarComentarioEncuesta)
api.put('/editarComentario/:idEncuesta/:idComentario',md_autenticacion.ensureAuth, encuestacontrolador.editarComentarioEncuesta)
api.get('/obtenerComentario/:idEncuesta/:idComentario',md_autenticacion.ensureAuth, encuestacontrolador.obtenerComentario)
api.delete('/eliminarComentario/:idComentario',md_autenticacion.ensureAuth, encuestacontrolador.eliminarComentario)
api.post('/textoComentario',md_autenticacion.ensureAuth, encuestacontrolador.textoComentario)
api.get('/obtenerEncuestaId/:idEncuesta', md_autenticacion.ensureAuth, encuestacontrolador.obtenerEncuestaId)
module.exports = api;