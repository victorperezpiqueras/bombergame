
function Juego() {
	this.partidas = {};
	this.usuarios = {};

	this.crearPartida = function (nombre, nick, callback) {
		var idp = nombre + nick;
		var partida;
		if (!this.partidas[idp]) {
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
	this.obtenerUsuarios = function (callback) {
		callback(this.usuarios);
	}
	this.obtenerUsuario = function (nick, callback) {////////////////////////////
		if (this.usuarios[nick]) {
			callback(this.usuarios[nick]);
		}
		else {
			callback({ nick: "" });
		}
	}
	this.obtenerPartidas = function (callback) {
		callback(this.partidas);
	}
	this.obtenerPartidasInicial = function (callback) {
		var partidas = [];
		for (var index in this.partidas) {
			if (this.partidas[index].fase.nombre == "inicial") {
				partidas.push(partidas[index]);
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
		this.partidas[idp].salir(nick);
		if (this.comprobarJugadores(idp) == 0) {
			this.eliminarPartida(idp);
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
		if (this.partidas[idp]) {
			jugadores = this.partidas[idp].jugadorPreparado(nick);
			callback(jugadores);
		}
	}
}

function Partida(nombre, idp) {
	this.nombre = nombre;
	this.idp = idp;
	this.jugadores = {};
	this.fase = new Inicial();
	this.agregarJugador = function (usr) {
		this.fase.agregarJugador(usr, this);
	};
	this.puedeAgregarJugador = function (usr) {
		this.jugadores[usr.nick] = usr;
		this.jugadores[usr.nick].preparado = "No preparado";/////////////////////////////
	};
	this.obtenerJugadores = function () {
		return this.jugadores;
	};
	this.salir = function (nick) {
		delete this.jugadores[nick];
		this.comprobarTodosPreparados();
	};
	this.jugadorPreparado = function (nick) {
		this.fase.jugadorPreparado(nick, this);
		//	this.jugadores[nick].preparado = "Preparado";
		//	this.comprobarTodosPreparados();
		return this.jugadores;
	};
	this.comprobarTodosPreparados = function () {
		var preparados = 0;
		//var preparados = true;
		for (var index in this.jugadores) {
			if (this.jugadores[index].preparado == "Preparado") preparados++;
			//if (this.jugadores[index].preparado == "No preparado") preparados=false;
		}
		if (preparados == Object.keys(this.jugadores).length) {
			console.log("Partida iniciada: " + this.nombre);
			return true;
		}
		return false;
		//return preparados;
	}
}

function Inicial() {
	this.nombre = "inicial";
	this.agregarJugador = function (nick, partida) {
		partida.puedeAgregarJugador(nick);
	}
	this.jugadorPreparado = function (nick, partida) {
		partida.jugadores[nick].preparado = "Preparado";
		if (partida.comprobarTodosPreparados()) {
			partida.fase = new Jugando();
		}
	}
}

function Jugando() {
	this.nombre = "jugando";
	this.agregarJugador = function (nick, partida) {
		console.log("El juego ya ha comenzado");
	}
	this.jugadorPreparado = function (nick, partida) {
		console.log("La partida ya ha comenzado");
	}
}

function Final() {
	this.nombre = "final";
	this.agregarJugador = function (nick, partida) {
		console.log("El juego ya ha terminado");
	}
	this.jugadorPreparado = function (nick, partida) {
		console.log("La partida ya ha acabado");
	}
}

function Usuario(nick) {
	this.nick = nick;
	this.preparado = "No preparado";//"Preparado"
}

module.exports.Juego = Juego;