function ClienteRest() {

	this.agregarUsuario = function (nick) {
		$.getJSON("/agregarUsuario/" + nick, function (data) {
			console.log(data);
			if (data.nick != "") {
				$.cookie("usr", JSON.stringify(data));
				mostrarUsuario(data);
			}
			else {
				mostrarAviso("Utiliza otro nick");
			}
		});
	}
	this.cerrarSesion = function () {
		var usr = JSON.parse($.cookie("usr"));
		$.getJSON("/cerrarSesion/" + usr.nick, function (data) {
			console.log(data);
			if (data.nick != "") {
				$.removeCookie('usr', { path: '/' });
				mostrarAgregarUsuario();
			}
			else {
				mostrarAviso("No se pudo borrar el usuario");
			}
		});
	}
	this.comprobarUsuario = function () {
		var usr = JSON.parse($.cookie("usr"));
		$.getJSON("/comprobarUsuario/" + usr.nick, function (data) {
			console.log(data);
			if (data.nick != "") {
				mostrarUsuario(data);
			}
			else {
				$.removeCookie("usr");
				mostrarAgregarUsuario();
			}
		});
	}

	this.crearPartida = function (nombrePartida) {
		var usr = JSON.parse($.cookie("usr"));
		$.getJSON("/crearPartida/" + nombrePartida + "/" + usr.nick, function (data) {
			console.log(data);
			mostrarPartida(data);
		});
	}
	this.unirAPartida = function (nombrePartida, nick) {
		$.getJSON("/unirAPartida/" + nombrePartida + "/" + nick, function (data) {
			console.log(data);
			mostrarPartida(data);
		});
	}
	this.obtenerPartidas = function () {
		$.getJSON("/obtenerPartidas", function (data) {
			console.log(data);
			mostrarListaPartidas(data);
		});
	}
	this.obtenerJugadores = function (nombrePartida) {
		$.getJSON("/obtenerJugadores/" + nombrePartida, function (data) {
			console.log(data);
		})
	}
}