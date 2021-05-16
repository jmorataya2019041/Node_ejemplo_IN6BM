'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var EncuestaSchema = Schema({
    titulo: String,
    descripcion: String,
    opinion: {
        si: Number,
        no: Number,
        ninguno: Number,
        usuariosEncuestados: []   
    },
    listaComentarios: [{
        textoComentario: String,
        idUsuarioComentario: { type: Schema.Types.ObjectId, ref: 'Usuario'} //Quién comento
    }],
    creadorEncuesta: {type: Schema.Types.ObjectId, ref: 'Usuario'} //Quién lo creo
})

module.exports = mongoose.model('Encuestas', EncuestaSchema);