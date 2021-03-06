var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

const dotenv = require('dotenv');
dotenv.config();

const mongoUser = process.env.mongoUser;
const mongoPass = process.env.mongoPass;

function Dao() {
    this.resultados = undefined;
    this.usuarios = undefined;
    this.personajes = undefined;

    /* RESULTADOS */
    this.insertarResultado = function (res, callback) {
        insertar(this.resultados, res, callback);
    };
    this.obtenerResultados = function (callback) {
        obtenerTodos(this.resultados, callback);
    };
    this.obtenerResultadosCriterio = function (criterio, callback) {
        obtener(this.resultados, criterio, callback);
    };
    /* this.modificarColeccionResultados = function (res, callback) {
        modificarColeccion(this.resultados, res, callback);
    }; */
    this.eliminarResultado = function (id, callback) {
        eliminar(this.resultados, { _id: ObjectID(id) }, callback);
    };

    /* USUARIOS */
    this.insertarUsuario = function (usr, callback) {
        insertar(this.usuarios, usr, callback);
    };
    this.obtenerUsuarios = function (callback) {
        obtenerTodos(this.usuarios, callback);
    };
    this.obtenerUsuariosCriterio = function (criterio, callback) {
        obtener(this.usuarios, criterio, callback);
    };
    this.modificarColeccionUsuarios = function (usr, callback) {
        modificarColeccion(this.usuarios, usr, callback);
    };
    this.eliminarUsuario = function (uid, callback) {
        eliminar(this.usuarios, { _id: ObjectID(uid) }, callback);
    };

    /* PERSONAJES */
    this.insertarPersonaje = function (per, callback) {
        insertar(this.personajes, per, callback);
    };
    this.obtenerPersonajes = function (callback) {
        obtenerTodos(this.personajes, callback);
    };
    this.obtenerPersonajeCriterio = function (criterio, callback) {
        obtener(this.personajes, criterio, callback);
    };
    this.eliminarPersonaje = function (uid, callback) {
        eliminar(this.personajes, { _id: ObjectID(uid) }, callback);
    };
    this.eliminarPersonajes = function (callback) {
        eliminar(this.personajes, {}, callback);
    };

    /* HELPERS */
    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    };
    function obtener(coleccion, criterio, callback) {
        coleccion.find(criterio).toArray(function (error, usr) {
            if (usr == null) callback(undefined);
            else if (usr.length == 0) {
                callback(undefined);
            }
            else {
                callback(usr[0]);
            }
        });
    };
    function obtenerTodos(coleccion, callback) {
        coleccion.find().toArray(function (error, col) {
            callback(col);
        });
    };
    function modificarColeccion(coleccion, usr, callback) {
        coleccion.findAndModify({ _id: ObjectID(usr._id) }, {}, usr, {}, function (err, result) {
            if (err) {
                console.log("No se pudo actualizar (método genérico)");
            }
            else {
                console.log("Usuario actualizado");
            }
            callback(result);
        });
    };
    function eliminar(coleccion, criterio, callback) {
        coleccion.remove(criterio, function (err, result) {
            if (!err) {
                callback(result);
            }
        });
    };


    /* CONNECTION */
    this.connect = function (callback) {
        var dao = this;
        mongo.connect("mongodb+srv://" + mongoUser + ":" + mongoPass + "@clustergame-safci.mongodb.net/bombergame?retryWrites=true&w=majority",
            { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
                if (err) {
                    console.log("No se pudo conectar a la base de datos");
                }
                else {
                    console.log("Conectado a MongoDB");
                    database.db("bombergame").collection("resultados", function (err, col) {
                        if (err) {
                            console.log("No pude obtener la coleccion")
                        }
                        else {
                            console.log("Tenemos la colección resultados");
                            dao.resultados = col;
                        }
                    });
                    database.db("bombergame").collection("usuarios", function (err, col) {
                        if (err) {
                            console.log("No pude obtener la coleccion")
                        }
                        else {
                            console.log("Tenemos la colección usuarios");
                            dao.usuarios = col;
                        }
                    });
                    database.db("bombergame").collection("personajes", function (err, col) {
                        if (err) {
                            console.log("No pude obtener la coleccion")
                        }
                        else {
                            console.log("Tenemos la colección personajes");
                            dao.personajes = col;
                        }
                    });
                    callback(database);
                }
            })
    }
    // this.connect();


}

module.exports.Dao = Dao;