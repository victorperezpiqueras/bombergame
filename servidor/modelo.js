var dao = require("./dao.js");
var cifrado = require("./cifrado.js");
var ObjectID = require("mongodb").ObjectID;

function Juego() {
	this.partidas = {};
	this.usuarios = {};
	this.dao = new dao.Dao();

	this.crearPartida = function (nombre, nick, callback) {
		var idp = nombre + nick;
		var partida;
		if (!this.partidas[idp]) {
			console.log("Nueva partida");
			partida = new Partida(nombre, idp);
			partida.agregarJugador(this.usuarios[nick]);
			//partida.jugadores[nick]=this.usuarios[nick];
			this.partidas[idp] = partida;
		}
		else {
			partida = this.partidas[idp];
		}
		callback(partida);
	}
	this.agregarUsuario = function (nombre, callback) {
		if (!this.usuarios[nombre]) {
			console.log("Nuevo usuario: " + nombre);
			this.usuarios[nombre] = new Usuario(nombre);
			callback(this.usuarios[nombre]);
		}
		else {
			callback({ nick: "" });
		}
	}
	this.obtenerUsuario = function (nick, callback) {
		if (this.usuarios[nick]) {
			callback(this.usuarios[nick]);
		}
		else {
			callback({ nick: "" });
		}
	}
	this.obtenerUsuarios = function (callback) {
		//callback(this.usuarios);
		console.log("obtener usuarios")
		this.dao.obtenerUsuarios(callback);
	}
	this.obtenerPartidas = function (callback) {
		callback(this.partidas);
	}
	this.obtenerPartidasInicial = function (callback) {
		partidas = {};
		for (var key in this.partidas) {
			if (this.partidas[key].fase.nombre == "inicial") {
				partidas[key] = this.partidas[key];
			}
		}
		callback(partidas);
	}
	this.unirAPartida = function (nombre, nick) {
		var partida = {};
		if (this.partidas[nombre] && this.usuarios[nick]) {
			this.partidas[nombre].agregarJugador(this.usuarios[nick]);
			partida = this.partidas[nombre];
		}
		return partida;
	}
	this.salir = function (idp, nick) {
		if (this.partidas[idp]) {
			this.partidas[idp].salir(nick);
			if (this.comprobarJugadores(idp) == 0) {
				this.eliminarPartida(idp);
			}
		}
		return this.partidas[idp];
	}
	this.comprobarJugadores = function (nombrePartida) {
		return Object.keys(this.partidas[nombrePartida].jugadores).length;
	}
	this.eliminarPartida = function (nombrePartida) {
		delete this.partidas[nombrePartida];
	}
	this.obtenerJugadoresPartida = function (nombrePartida, callback) {
		var jugadores = {};
		if (this.partidas[nombrePartida]) {
			jugadores = this.partidas[nombrePartida].obtenerJugadores();
		}
		callback(jugadores);
	}
	this.jugadorPreparado = function (idp, nick, callback) {
		//var jugadores=[];
		if (this.partidas[idp]) {
			this.partidas[idp].jugadorPreparado(nick);
			this.partidas[idp].jugadores;
		}
		callback(this.partidas[idp]);
	}
	this.cerrarSesion = function (nick, callback) {
		var data = { res: "nook" };
		if (this.usuarios[nick]) {
			delete this.usuarios[nick];
			data = { res: "ok" };
			console.log("Usuario " + nick + " cierra sesión");
		}
		callback(data);
	}
	this.enviarResultado = function (idp, nick, callback) {
		if (this.partidas[idp]) {
			this.partidas[idp].enviarResultado(nick);
			//this.partidas[idp].jugadores;
		}
		callback(this.partidas[idp]);
	}
	this.muereEnemigo = function (idp, nick, enemy, callback) {
		if (this.partidas[idp]) {
			this.partidas[idp].muereEnemigo(nick, enemy);
			//this.partidas[idp].jugadores;
		}
		callback(this.partidas[idp]);
	}
	this.jugadorHerido = function (idp, nick, callback) {
		if (this.partidas[idp]) {
			this.partidas[idp].jugadorHerido(nick);
			//this.partidas[idp].jugadores;
		}
		callback(this.partidas[idp]);
	}
	this.obtenerResultados = function (callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerResultados(callback);
			db.close();
		});
	}
	this.obtenerResultadosNick = function (nick, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerResultadosCriterio({ nickGanador: nick }, callback);
			db.close();
		});
	}
	this.anotarResultado = function (partida, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			var resultado = new Resultado(partida.nickGanador, partida.nombre, partida.nivel, partida.obtenerNickJugadores());
			juego.dao.insertarResultado(resultado, callback);
			db.close();
		});

	};
	this.registrarUsuario = function (user, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ $or: [{ nick: user.nick }, { email: user.email }] }, function (usuarios) {
				if (!usuarios) {
					user.password = cifrado.encrypt(user.password);
					console.log("Modelo-usuario:", user)
					juego.dao.insertarUsuario(user, function (user) {
						console.log("creado usuario")
						//callback({ "res": "ok" });
						callback(user);
					});
				}
				else {
					callback({ "res": "no ok" });
				}
				db.close();
			});
		});
	};
	this.loginUsuario = function (user, callback) {
		var juego = this;
		console.log(user);
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ nick: user.nick, password: cifrado.encrypt(user.password) }, function (usuario) {
				if (usuario) {
					console.log("encontrado usuario")
					/* 				dpassword = cifrado.decrypt(usuario.password);
					*/				/* console.log(dpassword)
								console.log("uipass:", user.password) */
					/* 		if (dpassword == user.password) {
								console.log("match pass"); */
					juego.agregarUsuario(usuario.nick, function () { })
					callback(usuario);//ARREGLAR
					/* }
					else callback({ "res": "no ok" }); */
				}
				else {
					//console.log(user)
					callback({ "res": "no ok" });
				}
				db.close();
			});
		});
	};
	this.actualizarUsuario = function (user, callback) {
		var oldC = cifrado.encrypt(user.oldpass);
		var newC = cifrado.encrypt(user.newpass);
		var juego = this;
		console.log(user)
		console.log(oldC)
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ _id: ObjectID(user.uid), password: oldC }, function (usr) {
				if (usr) {
					usr.password = newC;
					juego.dao.modificarColeccionUsuarios(usr, function (usuario) {
						console.log("Usuario modificado");
						callback(usr);//usr
					});
				}
				else {
					callback({ "res": "no ok" });
				}
				db.close();
			});
		});
	};
	this.actualizarDatosUsuario = function (newUser, callback) {//////////////////////////////////////////////
		var juego = this;
		console.log("new:", newUser)
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ _id: ObjectID(newUser._id)}, function (usr) {
				if (usr) {
					usr.email = newUser.email;
					juego.dao.modificarColeccionUsuarios(usr, function (usuario) {
						console.log("Usuario modificado");
						callback(usr);//usr
					});
				}
				else {
					callback({ "res": "no ok" });
				}
				db.close();
			});
		});
		/* this.dao.connect(function (db) {
			juego.dao.modificarColeccionResultados(newUser, function (usuario) {
				console.log("Usuario modificado");
				callback(usuario);//usr
			});
			db.close();
		}); */

	};
	this.eliminarUsuario = function (uid, callback) {
		var juego = this;
		var json = { 'resultados': -1 };
		this.dao.connect(function (db) {
			juego.dao.eliminarUsuario(uid, function (result) {
				if (result.result.n == 0) {
					console.log("No se pudo eliminar de usuarios");
				}
				else {
					json = { "resultados": 1 };
					console.log("Usuario eliminado de usuarios");
					callback(json);
				}
				db.close();
			});
		});
	}
	this.obtenerUsuarioNick = function (nick, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ nick: nick }, callback);
			db.close();
		});
	}

	this.statsPartidas = function (nick, callback) {
		var juego = this;
		var partidasJugadas = 0;
		var partidasGanadas = 0;

		this.dao.connect(function (db) {
			juego.dao.obtenerResultados(function (resultados) {
				for (var res of resultados) {
					for (var jug of res.jugadores) {
						if (jug == nick) {
							partidasJugadas++;
						}
					}
					if (res.nickGanador == nick) partidasGanadas++;
				}
				callback({
					partidasJugadas: partidasJugadas, partidasGanadas: partidasGanadas,
					ratio: ((partidasGanadas / partidasJugadas * 100).toFixed(2).toString() + '%')
				});
			});
			db.close();
		});
	};

	this.actualizarPartidasJugador = function (oldNick, newNick) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerResultados(function (resultados) {
				for (var res of resultados) {
					if (res.nickGanador == oldNick) res.nickGanador = newNick;
					for (var j of res.jugadores) {
						if (j == oldNick) j = newNick;
					}
					var newResultado = new Resultado(res.nickGanador, res.nombre, res.nivel, res.jugadores);
					juego.dao.insertarResultado(newResultado, function () { console.log("Resultado actualizado:") });
				}
			});
			db.close();
		});
	}

}

function Partida(nombre, idp) {
	this.nombre = nombre;
	this.nickGanador = "los bichos";
	this.nivel = 1;
	this.idp = idp;

	this.jugadores = {};
	this.enemigos = {};

	this.posiciones = [{ x: 16, y: 32 }, { x: 16, y: 224 }]; //{x:16*n,y:32}

	this.numJugadores = 0;
	this.numeroEnemigos = 4;

	this.fase = new Inicial();

	this.agregarJugador = function (usr) {
		this.fase.agregarJugador(usr, this);
	}
	this.puedeAgregarJugador = function (usr) {
		usr.ini();
		this.jugadores[usr.nick] = usr;
	}
	this.obtenerJugadores = function () {
		return this.jugadores;
	}
	this.salir = function (nick) {
		delete this.jugadores[nick];
	}
	this.jugadorPreparado = function (nick) {
		this.fase.jugadorPreparado(nick, this);
	}
	this.todosPreparados = function () {
		res = true;
		for (var key in this.jugadores) {
			if (this.jugadores[key].estado == "no preparado") {
				res = false;
			}
		}
		return res;
	}
	this.setTodosVivos = function () {
		for (var key in this.jugadores) {
			this.jugadores[key].estado = "vivo";
		}
		this.numJugadores = Object.keys(this.jugadores).length;
	}
	this.todosMuertos = function () {
		res = true;
		for (var key in this.jugadores) {
			if (this.jugadores[key].estado != "muerto") {
				res = false;
			}
		}
		return res;
	}
	this.enviarResultado = function (nick) {
		this.fase.enviarResultado(nick, this);
	}
	this.comprobarJugadores = function () {
		//console.log(jugadores);
		for (var key in this.jugadores) {
			if (this.jugadores[key].vidas <= 0) {
				this.jugadores[key].estado = "muerto";
				console.log("jugador muere");
			}
		}
	}
	this.comprobarGanador = function () {
		ganador = { vidas: 0 };
		for (var key in this.jugadores) {
			if (this.jugadores[key].vidas > ganador.vidas) {
				ganador = this.jugadores[key];
				this.nickGanador = key;
			}
		}
	}
	this.muereEnemigo = function (nick, enemy) {
		this.fase.muereEnemigo(nick, enemy, this);
	}
	this.jugadorHerido = function (nick) {
		this.fase.jugadorHerido(nick, this);
	}
	this.obtenerNickJugadores = function () {
		var nickJugadores = [];
		for (var nick in this.jugadores) {
			nickJugadores.push(nick);
		}
		return nickJugadores;
	}
	this.asignarPosicion = function () {
		var ind = 0;
		for (var key in this.jugadores) {
			this.jugadores[key].posicion = this.posiciones[ind];
			ind++;
		}
	}

}

function Inicial() {
	this.nombre = "inicial";
	this.agregarJugador = function (usr, partida) {
		partida.puedeAgregarJugador(usr);
	}
	this.jugadorPreparado = function (nick, partida) {
		partida.jugadores[nick].estado = "preparado";
		if (partida.todosPreparados()) {
			partida.fase = new Jugando();
			partida.setTodosVivos();
			partida.asignarPosicion();
		}
	}
	this.enviarResultado = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.muereEnemigo = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.jugadorHerido = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
}

function Jugando() {
	this.nombre = "jugando";
	this.agregarJugador = function (usr, partida) {
		console.log("El juego ya ha comenzado");
	}
	this.jugadorPreparado = function (nick, partida) {
		console.log("la partida ya ha comenzado");
	}
	this.enviarResultado = function (nick, partida) {
		partida.comprobarJugadores();
		if (partida.todosMuertos()) {
			partida.fase = new Final();
		}
		//comprobar que alguien haya ganado
	}
	this.muereEnemigo = function (nick, enemy, partida) {
		//partida.numeroEnemigos=partida.numeroEnemigos-1;
		partida.enemigos[enemy] = enemy;
		console.log("muere enemigo");
		if (Object.keys(partida.enemigos).length >= partida.numeroEnemigos) {
			partida.comprobarGanador();
			partida.fase = new Final();
		}
	}
	this.jugadorHerido = function (nick, partida) {
		if (partida.jugadores[nick].estado == "vivo") {
			partida.jugadores[nick].vidas = partida.jugadores[nick].vidas - 1;
			console.log("Jugador pierde 1 vida");
			partida.comprobarJugadores();
			if (partida.todosMuertos()) {
				partida.fase = new Final();
			}
		}
	}
}

function Final() {
	this.nombre = "final";
	this.agregarJugador = function (usr, partida) {
		console.log("El juego ya ha terminado");
	}
	this.enviarResultado = function (nick, partida) {
		console.log("La partida ha terminado");
	}
	this.muereEnemigo = function (nick, partida) {
		console.log("La partida ha terminado");
	}
	this.jugadorHerido = function (nick, partida) {
		console.log("La partida ha terminado");
	}
}

function Usuario(nick/* , id */) {
	this.nick = nick;
	/* this.id = id; */
	this.estado = "no preparado";
	this.vidas = 3;
	this.ini = function () {
		this.estado = "no preparado";
		this.vidas = 3;
	}
	this.actualizar = function (nick) {
		this.nick = nick;
	}
}

function Resultado(nickGanador, nombrePartida, nivel, jugadores) {
	this.nickGanador = nickGanador;
	this.nombrePartida = nombrePartida
	this.nivel = nivel;
	this.jugadores = jugadores;

}

module.exports.Juego = Juego;