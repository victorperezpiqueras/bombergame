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
	this.comprobarUsuario = function () {
		var usr = JSON.parse($.cookie("usr"));
		$.getJSON("/comprobarUsuario/" + usr.nick, function (data) {
			console.log(data);
			if (data.nick != "") {
				//$.cookie("usr",JSON.stringify(data));
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
	this.cerrarSesion = function () {
		var usr = JSON.parse($.cookie("usr"));
		$.getJSON("/cerrarSesion/" + usr.nick, function (data) {
			console.log(data);
			if (data.res != "ok") {
				mostrarUsuario(data);
			}
			else {
				$.removeCookie("usr");
				mostrarAgregarUsuario();
			}
		});
	}
	this.registrarUsuario = function (nick, email, emailr, password) {
		$.ajax({
			type: 'POST',
			url: '/registrarUsuario',
			data: JSON.stringify({ nick: nick, email: email, emailr: emailr, password: password }),
			success: function (data) {
				if (data.res == "no ok") {
					mostrarAviso("Registro incorrecto");
					console.log('No se ha podido registrar');
				}
				else {
					console.log("Usuario registrado");
					mostrarLogin()
				}
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}
	this.loginUsuario = function (nick, password) {
		$.ajax({
			type: 'POST',
			url: '/loginUsuario',
			data: JSON.stringify({ nick: nick, password: password }),
			success: function (data) {
				if (data.res == "no ok") {
					mostrarAviso("Login incorrecto");
					console.log('No se ha podido loguear');
				}
				else {
					$.cookie("usr", JSON.stringify(data.nick));
					mostrarUsuario(data);
				}
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}
}