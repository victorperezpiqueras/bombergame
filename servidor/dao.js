var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function Dao() {
    this.resultados = undefined;

    this.insertarResultado = function (res, callback) {
        insertar(this.resultados, res, callback);
    };
    this.obtenerResultados = function (callback) {
        obtenerTodos(this.resultados, callback);
    };
    this.obtenerResultadosCriterio = function (criterio, callback) {
        obtener(this.resultados, criterio, callback);
    }

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
            if (usr.length == 0) {
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





    this.connect = function () {
        var dao = this;
        mongo.connect("mongodb+srv://victorperezpiqueras:quieroquefuncione@clustergame-safci.mongodb.net/test?retryWrites=true&w=majority",
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

                }
            })
        //mongodb+srv://victorperezpiqueras:<password>@clustergame-safci.mongodb.net/test?retryWrites=true&w=majority
    }
    this.connect();


}

module.exports.Dao = Dao;