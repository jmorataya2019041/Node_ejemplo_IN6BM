'use strict'

//Importaciones
const express = require("express");
const usuariocontrolador = require("../controladores/usuario.controlador");

//Importando middlewares
var md_autenticacion = require('../middlewares/authenticated');

//Rutas
var api = express.Router();
api.get('/ejemplo', md_autenticacion.ensureAuth, usuariocontrolador.ejemplo);
api.post('/registrarUsuario',usuariocontrolador.registrar);
api.get('/obtenerUsuarios', usuariocontrolador.obtenerUsuarios);
api.get('/obtenerUsuarioID/:idUsuario',usuariocontrolador.obtenerUsuarioID);
api.post('/login',usuariocontrolador.login);
api.put('/editar/:idUsuario', md_autenticacion.ensureAuth ,usuariocontrolador.editar);
api.put('/editarAdmin/:idUsuario', md_autenticacion.ensureAuth, usuariocontrolador.editarAdmin)
api.delete('/delete/:idUsuario', md_autenticacion.ensureAuth, usuariocontrolador.eliminar)
api.delete('/eliminarAdmin/:idUsuario', md_autenticacion.ensureAuth, usuariocontrolador.eliminarAdmin)

module.exports = api;