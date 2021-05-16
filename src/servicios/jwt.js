'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'clave_secreta_IN6BM'

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        usuario: user.usuario,
        email: user.email,
        rol: user.rol,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().date(40,'days').unix()
    }

    return jwt.encode(payload, secret);
}