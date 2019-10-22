function ClienteRest() {

    this.agregarUsuario = function (nick) {
        $.getJSON("/agregarUsuario/" + nick, function (usuario) {
            console.log(usuario);
            if (usuario.nick != "") {
                mostrarUsuario(usuario);
                
            }
            else {
                mostrarErrorUsuario();
            }
        });
    }

    this.crearPartida = function (nombrePartida, nick) {
        $.getJSON("/crearPartida/" + nombrePartida + "/" + nick, function (partida) {
            console.log(partida);
        });
    }

    this.obtenerPartidas = function () {
        $.getJSON("/obtenerPartidas/", function (partidas) {
            console.log(partidas);
            mostrarObtenerPartidas(partidas);
        });
    }

    this.obtenerUsuarios = function () {
        $.getJSON("/obtenerUsuarios/", function (usuarios) {
            console.log(usuarios);
        });
    }

    this.unirAPartida = function (nombrePartida, nick) {
        $.getJSON("/unirAPartida/" + nombrePartida + "/" + nick, function (usuarios) {
            console.log(usuarios);
        });
    }

    this.obtenerJugadores = function (nombrePartida) {
        $.getJSON("/obtenerJugadores/" + nombrePartida, function (jugadores) {
            console.log(jugadores);
        });
    }




}