
function Juego() {
    this.partidas = {};
    this.usuarios = {};

    this.crearPartida = function (nombre, nick, callback) {
        var idp = nombre + nick;
        var partida;
        if (!this.partidas[idp]) {
            partida = new Partida(nombre, idp);
            partida.fase = new Inicial();
            partida.agregarJugador(this.usuarios[nick]);
            this.partidas[idp] = partida;
            console.log("Nueva partida: " + nombre);
        }
        else {
            partida = this.partidas[idp];
        }
        callback(partida);

    }
    this.agregarUsuario = function (nombre, callback) {

        if (!this.usuarios[nombre]) {
            this.usuarios[nombre] = new Usuario(nombre);
            console.log("Nuevo usuario: " + nombre);    
            callback(this.usuarios[nombre]);
        }
        else {
            callback({nick:''});
        }
    }

    this.obtenerPartidas = function (callback) {
        callback(this.partidas);
    }

    this.obtenerUsuarios = function (callback) {
        callback(this.usuarios);
    }

    this.obtenerPartida = function (nombrePartida) {
        return this.partidas[nombrePartida];
    }

    //SEGUNDA OPCION DE OBTENER JUGADORES QUE DELEGA EN PARTIDA:
    this.obtenerJugadoresPartida = function (nombrePartida, callback) {
        var jugadores = {};
        if (this.partidas[nombrePartida]) {
            jugadores = this.partidas[nombrePartida].obtenerJugadores();
        }
        callback(jugadores);
    }


    this.unirAPartida = function (idp, nick, callback) {
        if (this.partidas[idp] && this.usuarios[nick]) {
            this.partidas[idp].agregarJugador(this.usuarios[nick]);
        }
        callback(this.partidas[idp]);
    }

    this.salir = function (nombrePartida, nick) {
        this.partidas[nombrePartida].salir(nick);
        if (this.comprobarJugadores(nombrePartida) == 0) {
            this.eliminarPartida(nombrePartida);
        }
    }

    this.comprobarJugadores = function (nombrePartida) {
        return Object.keys(this.partidas[nombrePartida].jugadores).length;
    }

    this.eliminarPartida = function (nombrePartida) {
        delete this.partidas[nombrePartida];
    }

}

function Partida(nombre, idp) {
    this.nombre = nombre;
    this.idp = idp;
    this.jugadores = {};
    this.fase = new Inicial();
    this.obtenerJugadores = function () {
        return this.jugadores;
    }
    this.agregarJugador = function (usr) {
        this.fase.agregarJugador(usr, this);
    }
    this.puedeAgregarJugador = function (usr) {
        this.jugadores[usr.nick] = usr;
    }
    this.salir = function (nick) {
        delete this.jugadores[nick];
    }
}

function Inicial() {
    this.nombre = "inicial";
    this.agregarJugador = function (usr, partida) {
        partida.puedeAgregarJugador(usr);
    }
}
function Jugando() {
    this.nombre = "jugando";
    this.agregarJugador = function (usr, partida) {
        console.log("El juego ya ha comenzado");
    }
}
function Final() {
    this.nombre = "final";
    this.agregarJugador = function (usr, partida) {
        console.log("El juego ya ha terminado");
    }
}

function Usuario(nick) {
    this.nick = nick;
    this.id = undefined;
}

module.exports.Juego = Juego;

//module.exports.Inicial = Inicial;