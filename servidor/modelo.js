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
	this.agregarUsuario = function (nombre, personajeSeleccionado, callback) {
		if (!this.usuarios[nombre]) {
			console.log("Nuevo usuario: " + nombre);
			this.usuarios[nombre] = new Usuario(nombre, personajeSeleccionado);
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
		console.log("obtener usuarios");
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuarios(callback);
			db.close();
		});
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
	this.alcanzarMeta = function (idp, nick, callback) {
		if (this.partidas[idp]) {
			this.partidas[idp].alcanzarMeta(nick);
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
	this.jugadorCurado = function (idp, nick, callback) {
		if (this.partidas[idp]) {
			this.partidas[idp].jugadorCurado(nick);
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
	this.eliminarResultado = function (id, callback) {
		var juego = this;
		var json = { 'resultados': -1 };
		this.dao.connect(function (db) {
			juego.dao.eliminarResultado(id, function (result) {
				if (result.result.n == 0) {
					console.log("No se pudo eliminar de resultados");
				}
				else {
					json = { "resultados": 1 };
					console.log("Resultado eliminado de resultados");
				}
				callback(json);
				db.close();
			});
		});
	}
	this.anotarResultado = function (partida, nick, callback) {
		console.log("anotarResultado");
		var juego = this;
		this.dao.connect(function (db) {
			var resultado = new Resultado(partida.nickGanador, partida.nombre, partida.nivel, partida.obtenerNickJugadores(), partida.puntos);
			juego.dao.insertarResultado(resultado, function () {
				juego.aumentarDinero(nick, partida.puntos, function (usuario) {
					callback(usuario);
				});
			});
			db.close();
		});

	};
	this.registrarUsuario = function (user, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ $or: [{ nick: user.nick }, { email: user.email }] }, function (usuarios) {
				if (!usuarios) {
					user.password = cifrado.encrypt(user.password);
					user.personajes = [new Personaje("Default", "assets/images/personajes/Default.png", 0, 3, 50, 1, "El personaje por defecto")];
					user.personajeSeleccionado = new Personaje("Default", "assets/images/personajes/Default.png", 0, 3, 50, 1, "El personaje por defecto");
					user.dinero = 0;
					console.log("Modelo-usuario:", user);
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
				console.log("-------------------", usuario)
				if (usuario) {
					console.log("encontrado usuario login")
					juego.agregarUsuario(usuario.nick, usuario.personajeSeleccionado, function () { });
					callback(usuario);//ARREGLAR
					/* }
					else callback({ "res": "no ok" }); */
				}
				else {
					console.log("no ok login")
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
	this.actualizarDatosUsuario = function (newUser, callback) {
		var juego = this;
		console.log("new:", newUser)
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ _id: ObjectID(newUser._id) }, function (usr) {
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
				}
				callback(json);
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

	/* 	this.actualizarPartidasJugador = function (oldNick, newNick) {
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
		} */

	this.obtenerPersonajes = function (callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerPersonajes(function (pers) {
				console.log("obtenidos personajes")
				callback(pers);
				db.close();
			});

		});
	};

	this.generarPersonajes = function (callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.eliminarPersonajes(function (result) {
				console.log("no hay personajes");
				var personajes = [];
				personajes.push(new Personaje("Default", "assets/images/personajes/Default.png", 0, 3, 50, 1, "El personaje por defecto. No corre mucho ni tampoco aguanta, pero ahí está."));
				juego.dao.insertarPersonaje(personajes[0], function () { console.log("Insertado default") });
				personajes.push(new Personaje("Enemigo", "assets/images/personajes/Enemigo.png", 100, 3, 50, 1, "El enemigo básico, con los mismos stats que el personaje principal, pero más feo."));
				juego.dao.insertarPersonaje(personajes[1], function () { console.log("Insertado enemigo") });
				personajes.push(new Personaje("Orco", "assets/images/personajes/Orco.png", 300, 4, 40, 2, "El orco es algo más lento que los demás pero tiene 1 corazón extra de vida."));
				juego.dao.insertarPersonaje(personajes[2], function () { console.log("Insertado orco") });
				personajes.push(new Personaje("Shrek", "assets/images/personajes/Shrek.png", 10000, 10, 30, 5, "A Shrek se la suda todo, tiene 10 corazones y le da igual ser más lento que su abuela."));
				juego.dao.insertarPersonaje(personajes[3], function () { console.log("Insertado shrek") });
				personajes.push(new Personaje("Mago", "assets/images/personajes/Mago.png", 600, 2, 70, 3, "El mago es muy escurridizo aunque también bastante fragil si se le hiere. Lanza bolas de fuego."));
				juego.dao.insertarPersonaje(personajes[4], function () {
					console.log("Insertado mago")
					console.log("Insertados todos");
					callback(personajes)
					db.close();
				});

			});

		});
	};

	this.eliminarPersonajes = function (callback) {
		var juego = this;
		var json = { 'resultados': -1 };
		this.dao.connect(function (db) {
			juego.dao.eliminarPersonajes(function (result) {
				if (result.result.n == 0) {
					console.log("No se pudo eliminar personajes");
				}
				else {
					json = { "resultados": 1 };
					console.log("personajes eliminados");
				}
				callback(json);
				db.close();
			});
		});
	};

	this.comprarPersonaje = function (user, personaje, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerPersonajeCriterio({ nombre: personaje }, function (pers) {
				if (pers == null) {
					console.log("in", personaje)
					callback({ "res": "no personaje" });
					db.close();
				}
				else {
					console.log("obtener usuario")
					juego.dao.obtenerUsuariosCriterio({ _id: ObjectID(user._id) }, function (usr) {
						if (usr) {
							var comprado = false;
							console.log(usr);
							for (var perso of usr.personajes) {
								if (perso.nombre == personaje) {
									comprado = true;
								}
							}
							if (!comprado) {
								if (usr.dinero >= pers.precio) {

									//usr.personajes.push(pers.nombre);
									usr.personajes.push(pers);
									usr.dinero -= pers.precio;
									juego.dao.modificarColeccionUsuarios(usr, function (usuario) {
										console.log("Usuario modificado");
										callback(usr);//usr
									});
								}
								else {
									callback({ "res": "no dinero" });
								}
							}
							else callback({ "res": "personaje ya comprado" });
							db.close();
						}
						else {
							callback({ "res": "no user" });
							db.close();
						}
					});
				}
			});
		});
	}

	this.seleccionarPersonaje = function (user, personaje, callback) {
		var juego = this;
		//personaje="Shrek";
		this.dao.connect(function (db) {
			juego.dao.obtenerPersonajeCriterio({ nombre: personaje }, function (pers) {
				console.log("obtener usuario")
				juego.dao.obtenerUsuariosCriterio({ _id: ObjectID(user._id) }, function (usr) {
					if (usr) {
						var comprado = false;
						console.log(usr);
						for (var perso of usr.personajes) {
							console.log(perso.nombre == personaje)
							if (perso.nombre == personaje) {
								comprado = true;
							}
							console.log("pers", personaje)
						}
						if (comprado) {
							usr.personajeSeleccionado = pers;
							juego.obtenerUsuario(user.nick, function (usu) {
								usu.vidasTotales = pers.vidas;
								usu.vidas = pers.vidas;
								usu.velocidad = pers.velocidad;
								usu.bombas = pers.bombas;
								usu.personajeSeleccionado = pers;
							});

							juego.dao.modificarColeccionUsuarios(usr, function (usuario) {
								console.log("Usuario modificado");
								callback(usr);//usr
							});
							db.close();
						}
						else callback({ "res": "personaje no comprado" });

					}
					else {
						callback({ "res": "Error con la cuenta del usuario" });
						db.close();
					}
				});
			});
		});
	};
	/* this.obtenerVidasPersonaje = function (personaje, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerPersonajeCriterio({ nombre: personaje }, function (pers) {
				callback(pers.vidas);
			});
		});
	} */

	this.aumentarDinero = function (nick, puntos, callback) {
		var juego = this;
		this.dao.connect(function (db) {
			juego.dao.obtenerUsuariosCriterio({ nick: nick }, function (usr) {
				if (usr) {
					usr.dinero = usr.dinero + Math.round(puntos / 10);
					juego.dao.modificarColeccionUsuarios(usr, function (usuario) {
						console.log("Usuario aumentado dinero");
						callback(usr);//usr
					});
				}
				else {
					callback({ "res": "no ok" });
				}
				db.close();
			});
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

	this.puntos = 0;

	this.tiempoInicio = null;
	this.tiempoFinal = null;

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
	this.alcanzarMeta = function (nick) {
		this.fase.alcanzarMeta(nick, this);
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
	this.jugadorCurado = function (nick) {
		this.fase.jugadorCurado(nick, this);
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
	this.contarTiempo = function () {
		var puntosTiempo = (this.tiempoFinal.getTime() - this.tiempoInicio.getTime()) / 1000;
		this.puntos = this.puntos - parseInt(puntosTiempo.toFixed(0));
		if (this.puntos < 0) this.puntos = 0;
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
			partida.tiempoInicio = new Date();
			partida.setTodosVivos();
			partida.asignarPosicion();
		}
	}
	this.enviarResultado = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.alcanzarMeta = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.muereEnemigo = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.jugadorHerido = function (nick, partida) {
		console.log("La partida no se ha iniciado");
	}
	this.jugadorCurado = function (nick, partida) {
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
			partida.tiempoFinal = new Date();
			partida.contarTiempo();
		}
		//comprobar que alguien haya ganado
	}
	this.alcanzarMeta = function (nick, partida) {
		partida.puntos += 1000;
		partida.comprobarGanador();
		partida.fase = new Final();
		partida.tiempoFinal = new Date();
		partida.contarTiempo();
	}
	this.muereEnemigo = function (nick, enemy, partida) {
		partida.enemigos[enemy] = enemy;
		console.log("muere enemigo");
		partida.puntos += 100;
		if (Object.keys(partida.enemigos).length >= partida.numeroEnemigos) {
			partida.comprobarGanador();
			partida.fase = new Final();
			partida.tiempoFinal = new Date();
			partida.contarTiempo();
		}
	}
	this.jugadorHerido = function (nick, partida) {
		if (partida.jugadores[nick].estado == "vivo") {
			partida.jugadores[nick].vidas = partida.jugadores[nick].vidas - 1;
			console.log("Jugador pierde 1 vida");
			partida.comprobarJugadores();
			if (partida.todosMuertos()) {
				partida.fase = new Final();
				partida.tiempoFinal = new Date();
				partida.contarTiempo();
			}
		}
	}
	this.jugadorCurado = function (nick, partida) {
		if (partida.jugadores[nick].estado == "vivo") {
			if (partida.jugadores[nick].vidas + 1 <= 3) partida.jugadores[nick].vidas = partida.jugadores[nick].vidas + 1;
			console.log("Jugador gana 1 vida");
			partida.comprobarJugadores();
			if (partida.todosMuertos()) {
				partida.fase = new Final();
				partida.tiempoFinal = new Date();
				partida.contarTiempo();
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
	this.alcanzarMeta = function (nick, partida) {
		console.log("La partida ha terminado");
	}
	this.muereEnemigo = function (nick, partida) {
		console.log("La partida ha terminado");
	}
	this.jugadorHerido = function (nick, partida) {
		console.log("La partida ha terminado");
	}
	this.jugadorCurado = function (nick, partida) {
		console.log("La partida ha terminado");
	}
}

function Usuario(nick, personaje/* , vidas, velocidad *//* , id */) {
	this.nick = nick;
	/* this.id = id; */
	this.estado = "no preparado";
	// Nuevos atributos:
	this.vidasTotales = personaje.vidas;
	this.vidas = personaje.vidas;
	this.velocidad = personaje.velocidad;
	this.bombas = personaje.bombas;

	this.ini = function () {
		this.estado = "no preparado";
		this.vidas = this.vidasTotales;
		//console.log(this)
	}
	this.actualizar = function (nick) {
		this.nick = nick;
	}
	//this.personajes = ["Default"];
	this.personajes = [new Personaje("Default", "assets/images/personajes/Default.png", 0, 3, 1, 50, 1)];
	this.personajeSeleccionado = personaje;
	this.dinero = 0;
}

function Resultado(nickGanador, nombrePartida, nivel, jugadores, puntos) {
	this.nickGanador = nickGanador;
	this.nombrePartida = nombrePartida
	this.nivel = nivel;
	this.jugadores = jugadores;
	this.puntos = puntos;
}

function Personaje(nombre, imagen, precio, vidas, velocidad, bombas, descripcion) {
	this.nombre = nombre;
	this.imagen = imagen;
	this.precio = precio;
	this.vidas = vidas;
	this.velocidad = velocidad;
	this.descripcion = descripcion;
	this.bombas = bombas;
}

module.exports.Juego = Juego;
module.exports.Partida = Partida;
module.exports.Resultado = Resultado;
module.exports.Personaje = Personaje;