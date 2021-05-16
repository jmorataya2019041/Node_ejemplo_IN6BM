const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    image: String
},{collection: 'usuario'})

module.exports = mongoose.model('Usuario', UsuarioSchema)