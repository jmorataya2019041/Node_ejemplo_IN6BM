'use strict'

var Encuesta = require('../modelos/encuesta.model');

//Agregar una encuesta
function crearEncuesta(req, res){
    var params = req.body;
    var encuestaModel = new Encuesta();

    if(params.titulo && params.descripcion){
        encuestaModel.titulo = params.titulo;
        encuestaModel.descripcion = params.descripcion;
        encuestaModel.opinion = {
            si:0,
            no:0,
            ninguna:0,
            usuariosEncuestados: []
        };
        encuestaModel.creadorEncuesta = req.user.sub;

        encuestaModel.save((err, encuestaGuardada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la petición de la encuesta'})
            if(!encuestaGuardada) return res.status(500).send({mensaje: 'Error al agregar la encuesta'})
            return res.status(200).send({encuestaGuardada});
        })
    }else{
        res.status(500).send({mensaje: 'Rellene los datos necesarios para crear la encuesta'})
    }
}

//Encontrar todas las encuestas
function encontrarEncuestas(req, res) {
    Encuesta.find().populate('creadorEncuesta listaComentarios.idUsuarioComentario', 'nombre email').exec((err, encuestasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición de encuestas'})
        if(!encuestasEncontradas) return res.status(500).send({mensaje: 'Error al obtener las Encuestas'})
        return res.status(200).send({encuestasEncontradas})
    })
}

//Función agregar Comentario Encuesta
function agregarComentarioEncuesta(req, res) {
    var encuestaID = req.params.idEncuesta
    var params = req.body;
    
    Encuesta.findByIdAndUpdate(encuestaID, {$push: {listaComentarios: { textoComentario: params.textoComentario, idUsuarioComentario: req.user.sub}}},
        {new: true, useFindAndModify: false}, (err, comentarioAgregado) =>{
            if(err) return res.status(500).send({mensaje: 'Error en la petición'})
            if(!comentarioAgregado) return res.status(500).send({mensaje: 'Error al agregar el comentario'})
            return res.status(200).send({comentarioAgregado})
        })
}

//Función para editar un comentario de Encuesta
function editarComentarioEncuesta(req, res) {
    var encuestaId = req.params.idEncuesta;
    var comentarioId = req.params.idComentario
    var params = req.body

    Encuesta.findOneAndUpdate({_id: encuestaId, "listaComentarios._id": comentarioId, "listaComentarios.idUsuarioComentario":req.user.sub}, {"listaComentarios.$.textoComentario": params.comentario},
    {new: true, useFindAndModify:false}, (err, comentarioEditado) =>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})
        if(!comentarioEditado) return res.status(500).send({mensaje: 'No posee los permisos para editar'})
        return res.status(200).send({comentarioEditado})
    })
}

//Función para obtener el comentario
function obtenerComentario(req, res) {
    var encuestaId = req.params.idEncuesta;
    var comentarioId = req.params.idComentario

    Encuesta.findOne({_id: encuestaId, "listaComentarios._id": comentarioId, "listaComentarios.idUsuarioComentario": req.user.sub}, {"listaComentarios.$":1, titulo:1}, (err, comentarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"})
        if(!comentarioEncontrado) return res.status(500).send({mensaje: "Error al obtener el comentario"})
        return res.status(200).send({comentarioEncontrado})
    })
}

//Función para eliminar el comentario
function eliminarComentario(req, res) {
    var comentarioId = req.params.idComentario;

    Encuesta.findOneAndUpdate({"listaComentarios._id": comentarioId},{$pull:{listaComentarios: {_id: comentarioId}}},{new:true, useFindAndModify: false},(err, comentarioEliminado)=>{
        if(err){
            return res.status(500).send({mensaje: 'Error en la petición'})
        }else if(!comentarioEliminado){
            return res.status(500).send({Alerta: 'Error al eliminar comentario'})
        }else{
            return res.status(200).send({Comentario_Eliminado: comentarioEliminado})
        }
    })
}

//Función para buscar por texto de comentario
function textoComentario(req, res) {
    var textoComentario = req.body.textoComentario;

    Encuesta.aggregate([
        {
            $unwind: "$listaComentarios" // <---- Crea un modelo independiente temporalmente
        },
        {
            $match: {"listaComentarios.textoComentario": {$regex: textoComentario, $options:'i'}} // <----- 
        },
        {
            $group: { // <---- Crea un grupo aparte en donde se le añade lo que queremos asignar
                "_id": "$_id",
                "listaComentarios": {$push: "$listaComentarios"}
            }
        }
    ], (err, encuestaEncontrada)=>{
        if(err){
            return res.status(500).send({mensaje: 'Error en la petición'})
        }else if(!encuestaEncontrada){
            return res.status(500).send({mensaje: 'No se ha podido obtener el dato'})
        }else{
            return res.status(200).send({Comentario: encuestaEncontrada})
        }
    })

    /*Encuesta.find({"listaComentarios.textoComentario":{$regex: textoComentario, $options: 'i'}},{"listaComentarios.$":1},(err, encuestasEncontradas)=>{
        if(err){
            return res.status(500).send({mensaje: 'Error en la petición'})
        }else if(!encuestasEncontradas){
            return res.status(500).send({mensaje: 'Error al obtener los comentarios'})
        }else{
            return res.status(200).send({Comentario: encuestasEncontradas})
        }
    })*/
}

//Función para buscar una encuesta por ID
function obtenerEncuestaId(req, res){
    var idEncuesta = req.params.idEncuesta;
    Encuesta.findById(idEncuesta).populate('creadorEncuesta listaComentarios.idUsuarioComentario', 'usuario email image').exec((err, encuestaSee)=>{
        if(err){
            return res.status(500).send({mensaje: "Error en la petición encuesta"})
        }else if(!encuestaSee){
            return res.status(500).send({mensaje: "No se ha obtenido la encuesta"})
        }else{
            return res.status(200).send({encuestaSee})
        }
    })

}


module.exports = {
    crearEncuesta,
    encontrarEncuestas,
    agregarComentarioEncuesta,
    editarComentarioEncuesta,
    obtenerComentario,
    eliminarComentario,
    textoComentario,
    obtenerEncuestaId
}