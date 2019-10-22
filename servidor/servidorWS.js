function ServidorWS() {
    this.enviarRemitente = function (socket, mens, datos) {
        socket.emit(mens, datos);
    }
    this.enviarATodos = function (io, nombre, mens, datos) {
        io.sockets.in(nombre).emit(mens, datos);
    }
    this.enviarATodosMenosRemitente = function (socket, nombre, mens, datos) {
        socket.broadcast.to(nombre).emit(mens, datos)
    };
    this.lanzarSocketSrv = function (io, juego) {
        var cli = this;
        io.on('connection', function (socket) {
            console.log("new socket");
            socket.on('crearPartida', function (nick, idp) {
                juego.crearPartida(idp, nick, function (partida) {
                    cli.enviarRemitente(socket, "partidaCreada", partida);
                    //se une a una sala de socket con el nombre de la partida
                    socket.join(partida.idp);
                });
            });
            socket.on('unirAPartida', function (nick, idp) {
                juego.unirAPartida(idp, nick, function (partida) {
                    cli.enviarRemitente(socket, "unidoPartida", partida);
                    socket.join(partida.idp);
                    cli.enviarATodosMenosRemitente(socket,idp, "nuevoJugador", partida.jugadores);//
                });
            });
            socket.on('salirPartida', function (nick, idp) {
                juego.salir(idp, nick);
                cli.enviarATodos(socket, idp, "salidoPartida", partida);
            });
        });
    }


}

module.exports.ServidorWS = ServidorWS;