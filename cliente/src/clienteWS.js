function ClienteWS(nick) {
    this.socket = undefined;
    this.nick = nick;
    this.idp = undefined;
    this.ini = function () {
        this.socket = io.connect();
        this.lanzarSocketSrv();
    }
    this.lanzarSocketSrv = function () {
        var cli = this;
        this.socket.on('connect', function () {
            console.log("Usuario conectado al servidor de WebSockets");
        });
        this.socket.on('partidaCreada', function (partida) {
            console.log("Partida creada:", partida);
            cli.idp=partida.idp;
            mostrarPartida(partida);
            mostrarListaJugadores(partida.jugadores);
        });
        //this socket on partidas mostrar lista partidas
        this.socket.on('unidoPartida', function (partida) {
            console.log("Unido a partida:", partida);
            mostrarPartida(partida);
            mostrarListaJugadores(partida.jugadores);
        });
        this.socket.on('salidoPartida', function (partida) {
            console.log("salido de la partida:", partida);
            mostrarListaPartidas();
        });
        this.socket.on('nuevoJugador', function (jugadores) {
            mostrarListaJugadores(jugadores);
        });
    }
    this.crearPartida = function (idp) {
        //this.nombrePartida=nombre;
        this.socket.emit('crearPartida', this.nick, idp);
        console.log("usuario " + this.nick + " crea partida " + idp);
    }
    this.unirAPartida = function (idp, nick) {
        this.socket.emit('unirAPartida', nick, idp);
        console.log("usuario " + nick + " se une a partida " + idp);
    }
    this.salirPartida = function () {
        this.socket.emit('salirPartida', this.nick, this.idp);
        console.log("usuario " + this.nick + " se sale de la partida " + this.idp);
    }



}