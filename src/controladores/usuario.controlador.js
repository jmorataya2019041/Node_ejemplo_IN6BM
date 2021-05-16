'use strict'

// Importaciones
const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

//Otra forma de exportar
/*export.ejemplo = (req, res) =>{
    res.status(200).send({mensaje: "Hola, soy un ejemplo! :D"})
}*/

// Función ejemplo
function ejemplo(req, res){
    res.status(200).send({mensaje: `Hola, mi nombre es ${req.user.nombre}, email: ${req.user.email}`})
}

//Registrar usuario
function registrar(req,res){
    var usuarioModel = new Usuario();
    var params = req.body;
    
    if(params.usuario && params.email && params.password){
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = "Rol_Usuario";
        usuarioModel.image = null;

        Usuario.find({ $or: [
            {usuario: usuarioModel.usuario},
            {email: usuarioModel.email}
        ] }).exec((err, usuariosEncontrados) => {
            if(err){return res.status(500).send({mensaje: "Error en la petición del usuario"})}
                if(usuariosEncontrados && usuariosEncontrados.length >= 1){
                    return res.status(500).send({mensaje: "El usuario ya existe!"})
                }else{
                    bcrypt.hash(params.password, null, null, (err, passwordEncrypt) =>{
                        usuarioModel.password = passwordEncrypt;

                        usuarioModel.save((err, usuarioGuardado) =>{
                            if(err) return res.status(500).send({mensaje: 'Error al guardar el Usuario'})
                            if(usuarioGuardado){
                                res.status(200).send(usuarioGuardado)
                            }else{
                                res.status(404).send({mensaje: 'No se ha podido registrar el usuario'})
                            }
                        });
                    })
                }
        })
    }
}

//Obtener usuarios
function obtenerUsuarios(req, res) {
    Usuario.find((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición de obtener usuarios'})
        if(!usuariosEncontrados) return res.status(500).send({mensaje: "Error en la consulta de usuarios"})
        return res.status(200).send({Usuarios: usuariosEncontrados})
    })
}

//Obtener solo un usuario
function obtenerUsuarioID(req, res){
    var idUsuario = req.params.idUsuario
    //User.find({_id: idUsuario}, (err, usuarioEncontrado)=>{})   Me retorna un Array = [] || usuarioEncontrado[0].nombre
    //User.dinOne <---- Me retorna un objeto = {} || usuarioEncontrado.nombre

    Usuario.findById(idUsuario,(err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"})
        if(!usuarioEncontrado) return res.status(404).send({mensaje: "Error al obtener los datos" })
        return res.status(200).send({Usuario: usuarioEncontrado})
    })
}

//Función para logear
function login(req, res){
    var params = req.body;
    Usuario.findOne({email: params.email}, (err, usuarioEncontrado) => {
        if(err){return res.status(500).send({mensaje: 'Error en la petición'})}
        if (usuarioEncontrado) {                                               //Retorna un true o un false
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrect)=>{
                if (passCorrect) {
                    if(params.getToken === 'true'){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    res.status(404).send({mensaje: 'El usuario no se ha podido identificar'})
                }
            });
        }else{
            res.status(404).send({mensaje: 'El usuario no ha podido ingresar'})
        }
    })
}

//Función para editar usuario
function editar(req, res){
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    //Borrar la propiedad de password para que no se pueda editar
    delete params.password;
    
    //req.user.sub <- id usuario logeado
    if(idUsuario != req.user.sub){
        return res.status(404).send({mensaje: 'No tiene la autorización para editar'})
    }

    Usuario.findByIdAndUpdate(idUsuario, params, {new: true}, (err, usuarioEditado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})
        if(!usuarioEditado) res.status(500).send({mensaje: 'Error al editar al usuario'});
        return res.status(200).send({usuarioEditado});
    })
}

//Función para editar por rol de Admin
function editarAdmin(req, res){
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    //Borrar la propiedad de password para que no se pueda eliminar
    delete params.password;
    
    //Verificar por usuario Admin
    if(req.user.rol != "Rol_Admin"){
        return res.status(404).send({mensaje: "Solo el administrador puede editar al usuario"})
    }

    Usuario.findByIdAndUpdate(idUsuario, params, {new: true}, (err, usuarioEditado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})
        if(!usuarioEditado) res.status(500).send({mensaje: 'Error al editar al usuario'});
        return res.status(200).send({usuarioEditado});
    })
}

//Función para eliminar el usuario por rol
function eliminarAdmin(req, res){
    const idUsuario = req.params.idUsuario;

    //Verificar por usuario Admin
    if (req.user.rol != "Rol_Admin") {
        return res.status(500).send({mensaje: 'Solo el administrador puede eliminar al usuario'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) res.status(500).send({mensaje: 'Error en la petición de eliminar'})
        if(!usuarioEliminado) return res.status(500).send({mensaje: 'El usuario no se ha podido eliminar'})
        return res.status(200).send(usuarioEliminado)
    })
}

//Función para eliminar usuario
function eliminar(req, res){
    const idUsuario = req.params.idUsuario;

    // requ.user.sub <- id del usuario logeado
    if (idUsuario != req.user.sub) {
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar el usuario'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) res.status(500).send({mensaje: 'Error en la petición de eliminar'})
        if(!usuarioEliminado) return res.status(500).send({mensaje: 'El usuario no se ha podido eliminar'})
        return res.status(200).send("Usuario eliminado: "+usuarioEliminado)
    })
}

//Módulos de exportación para las rutas
module.exports = {
    ejemplo,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editar,
    editarAdmin,
    eliminar,
    eliminarAdmin
}