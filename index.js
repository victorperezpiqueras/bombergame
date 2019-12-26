var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var exp = require("express");
var app = exp();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var srvWS = require('./servidor/servidorWS.js');
var ws = new srvWS.ServidorWS();
var modelo = require("./servidor/modelo.js");

var juego = new modelo.Juego();
app.set('port', (process.env.PORT || 5000));

app.use(exp.static(__dirname + "/cliente"));

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.get("/",function(request,response){
// 	response.send("hola");
// });

app.get("/agregarUsuario/:nick", function (request, response) {
	var nick = request.params.nick;
	juego.agregarUsuario(nick, function (usr) {
		response.send(usr);
	});
});

app.get("/comprobarUsuario/:nick", function (request, response) {
	var nick = request.params.nick;
	juego.obtenerUsuario(nick, function (usr) {
		response.send(usr);
	})
});

app.get("/crearPartida/:nombrePartida/:nick", function (request, response) {
	var nick = request.params.nick;
	var nombrePartida = request.params.nombrePartida;
	console.log("Usuario " + nick + " crea la partida " + nombrePartida);
	juego.crearPartida(nombrePartida, nick, function (partida) {
		response.send(partida);
	});
});

app.get("/obtenerPartidas", function (request, response) {
	juego.obtenerPartidas(function (partidas) {
		response.send(partidas);
	})
});

app.get("/obtenerUsuarios", function (request, response) {
	juego.obtenerUsuarios(function (usuarios) {
		response.send(usuarios);
	})
});

app.get("/unirAPartida/:nombrePartida/:nick", function (request, response) {
	var nick = request.params.nick;
	var nombrePartida = request.params.nombrePartida;
	console.log("Usuario " + nick + " se une a la partida " + nombrePartida);
	var partida = {};
	partida = juego.unirAPartida(nombrePartida, nick);
	response.send(partida);
});

app.get("/obtenerJugadores/:nombrePartida", function (request, response) {
	var nombrePartida = request.params.nombrePartida;
	juego.obtenerJugadoresPartida(nombrePartida, function (jugadores) {
		response.send(jugadores);
	})
});

app.get("/cerrarSesion/:nick", function (request, response) {
	var nick = request.params.nick;
	//var data={res:"nook"};
	juego.cerrarSesion(nick, function (data) {
		response.send(data);
	});
});

app.get("/obtenerResultados", function (request, response) {
	juego.obtenerResultados(function (resultados) {
		response.send(resultados);
	})
});

app.get("/obtenerResultados/:nick", function (request, response) {
	var nick = request.params.nick;
	juego.obtenerResultadosNick(nick, function (resultados) {
		response.send(resultados);
	})
});

app.post("/registrarUsuario", function (request, response) {
	//COMPROBAR CAMPOS VACIOS
	if (!request.body.email || !request.body.emailr || !request.body.nick || !request.body.password
		|| (request.body.email.localeCompare(request.body.emailr) != 0)
	) {
		response.send("Hay campos vacios o el correo no coincide");
		console.log("Hay campos vacios o el correo no coincide");
	} else {
		juego.registrarUsuario(request.body, function (resultados) {
			response.send(resultados);
			console.log("resultados:", resultados);
		})
	}
});

app.post("/loginUsuario", function (request, response) {
	//COMPROBAR CAMPOS VACIOS
	if (!request.body.nick || !request.body.password) {
		response.send("Hay campos vacios");
		console.log("Hay campos vacios");
	} else {
		console.log(request.body);
		juego.loginUsuario(request.body, function (resultados) {
			response.send(resultados);
			console.log("resultados:", resultados);
		})
	}
});

app.put("/actualizarUsuario", function (request, response) {
	juego.actualizarUsuario(request.body, function (result) {
		response.send(result);
	});
});

app.put("/actualizarDatosUsuario", function (request, response) {
	juego.actualizarDatosUsuario(request.body, function (result) {
		response.send(result);
	});
});

app.delete("/eliminarUsuario/:uid", function (request, response) {
	var uid = request.params.uid;
	juego.eliminarUsuario(uid, function (result) {
		response.send(result);
	});
});

app.get("/obtenerStatsPartidas/:nick", function (request, response) {
	var nick = request.params.nick;
	juego.statsPartidas(nick, function (stats) {
		response.send(stats);
	})
});

/* PERSONAJES */
app.post("/generarPersonajes", function (request, response) {
	juego.generarPersonajes(function (resultado) {
		response.send(resultado);
	})
});

app.get("/obtenerPersonajes", function (request, response) {
	juego.obtenerPersonajes(function (resultado) {
		response.send(resultado);
	})
});

app.put("/seleccionarPersonaje", function (request, response) {
	var user = request.body.user;
	var personaje = request.body.personaje;
	juego.seleccionarPersonaje(user, personaje, function (resultado) {
		response.send(resultado);
	})
});

app.post("/comprarPersonaje", function (request, response) {
	var user = request.body.user;
	var personaje = request.body.personaje;
	juego.comprarPersonaje(user, personaje, function (resultado) {
		response.send(resultado);
	})
});

//console.log("Servidor escuchando en "+host+":"+port);
//app.listen(port,host);
server.listen(app.get('port'), function () {
	console.log('Node app se está ejecutando en el puerto', port);

});

ws.lanzarSocketSrv(io, juego);