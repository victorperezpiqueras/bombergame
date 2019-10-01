function Juego() {
    this.partidas = [];
    this.usuarios = [];

    this.crearPartida = function (nombre, nick) {
        var idp = nombre + nick;
        if (!this.partidas[idp]) {
            this.partidas[idp] = new Partida(nombre, idp);
            this.partidas[idp].agregarJugador(this.usuarios[nick]);
        }

    }
    this.agregarUsuario = function (nombre) {

        if (!this.usuarios[nombre]) {
            this.usuarios[nombre] = new Usuario(nombre);
        }
    }

    this.obtenerPartidas = function () {
        return this.partidas;
    }

    this.unirAPartida = function (idp, nick) {
        if (this.partidas[idp] && this.usuarios[nick]) {
            this.partidas[idp].agregarJugador(this.usuarios[nick]);
        }
    }

}

function Partida(nombre, idp) {
    this.nombre = nombre;
    this.idp = idp;
    this.jugadores = [];
    this.agregarJugador = function (usr) {
        this.jugadores[usr.nick] = usr;
    }
}

function Usuario(nick) {
    this.nick = nick;
    this.id = undefined;
}

