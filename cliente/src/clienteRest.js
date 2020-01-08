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
	this.obtenerResultados = function () {
		mostrarCargando();
		$.getJSON("/obtenerResultados", function (data) {
			quitarCargando();
			mostrarResultados(data);
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
				//mostrarUsuario(data);
				mostrarLoginUsuario();
			}
			else {
				$.removeCookie("usr");
				//mostrarAgregarUsuario();

				mostrarLoginUsuario();
			}
		});
	}
	this.registrarUsuario = function (nick, email, emailr, password) {
		mostrarCargando();
		if (!nick || !email || !emailr || !password) {
			quitarCargando();
			mostrarAviso("Rellena todos los campos");
		}
		else if (email != emailr) {
			quitarCargando();
			mostrarAviso("Los correos deben coincidir");
		}
		else {
			$.ajax({
				type: 'POST',
				url: '/registrarUsuario',
				data: JSON.stringify({ nick: nick, email: email, emailr: emailr, password: password }),
				success: function (data) {
					quitarCargando();
					if (data.res == "no ok") {
						mostrarAviso("Ya existe un usuario con ese correo o ese nick");
						console.log('No se ha podido registrar');
					}
					else {
						console.log("Usuario registrado");
						mostrarLoginUsuario();
					}
				},
				contentType: 'application/json',
				dataType: 'json'
			});
		}
	}
	this.loginUsuario = function (nick, password) {
		mostrarCargando();
		if (!nick || !password) {
			quitarCargando();
			mostrarAviso("Rellena todos los campos");
		}
		else {
			$.ajax({
				type: 'POST',
				url: '/loginUsuario',
				data: JSON.stringify({ nick: nick, password: password }),
				success: function (data) {
					quitarCargando();
					if (data.res == "no ok") {
						mostrarAviso("Usuario o contraseña no coinciden");
						console.log('No se ha podido loguear');
					}
					else {
						$.cookie("usr", JSON.stringify(data));
						mostrarUsuario(data);
					}
				},
				contentType: 'application/json',
				dataType: 'json'
			});
		}
	};
	this.actualizarUsuario = function (oldpass, newpass) {
		if (oldpass.indexOf('<') > -1 || newpass.indexOf('<') > -1) {
			mostrarAviso("Caracter no permitido");
		}
		else {
			var usr = JSON.parse($.cookie("usr"));
			console.log("old:", oldpass, " new:", newpass)
			console.log(usr);
			$.ajax({
				type: 'PUT',
				url: '/actualizarUsuario',
				data: JSON.stringify({ uid: usr._id, oldpass: oldpass, newpass: newpass }),
				success: function (data) {
					if (data.res == "no ok") {
						mostrarAviso("La contraseña no es correcta")
						//mostrarRegistro();
					}
					else {
						$.cookie("usr", JSON.stringify(data));
						console.log("Actualización correcta")
						mostrarUsuario(data);
					}

				},
				contentType: 'application/json',
				dataType: 'json'
			});
		}
	};

	this.actualizarDatosUsuario = function (nick, email) {
		if (nick.indexOf('<') > -1 || email.indexOf('<') > -1) {
			mostrarAviso("Caracter no permitido");
		}
		else {
			var usr = JSON.parse($.cookie("usr"));
			usr.email = email;
			$.ajax({
				type: 'PUT',
				url: '/actualizarDatosUsuario',
				data: JSON.stringify(usr),
				success: function (data) {
					if (data.res == "no ok") {
						mostrarAviso("Error al modificar los datos")
					}
					else {
						$.cookie("usr", JSON.stringify(data));
						console.log("Actualización correcta")
						mostrarCuentaUsuario();
					}

				},
				contentType: 'application/json',
				dataType: 'json'
			});
		}

	};

	this.eliminarUsuario = function () {
		var usr = JSON.parse($.cookie("usr"));
		$.ajax({
			type: 'DELETE',
			url: '/eliminarUsuario/' + usr._id,
			data: '{}',
			success: function (data) {
				if (data.resultados == 1) {
					//mostrarLogin();
					//mostrarNavLogin();
					mostrarAviso("Usuario eliminado");
					mostrarLoginUsuario();
				}
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}

	this.obtenerStatsPartidas = function (nick) {
		mostrarCargando();
		$.getJSON("/obtenerStatsPartidas/" + nick, function (stats) {
			mostrarPartidasGanadas(stats);
			quitarCargando();
		});
	}

	this.obtenerPersonajes = function () {
		mostrarCargando();
		var usr = JSON.parse($.cookie("usr"));
		$.ajax({
			type: 'GET',
			url: '/obtenerPersonajes/',
			data: '{}',
			success: function (data) {
				//ordenar por precio:
				data.sort((a, b) => a.precio > b.precio);
				console.log("Personajes ", data);
				mostrarPersonajes(data);
				quitarCargando();
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}

	this.comprarPersonaje = function (personaje) {
		mostrarCargando();
		var usr = JSON.parse($.cookie("usr"));
		$.ajax({
			type: 'POST',
			url: '/comprarPersonaje/',
			data: JSON.stringify({ user: usr, personaje: personaje }),
			success: function (data) {
				if (data.res == "no dinero") mostrarAviso("No tienes bombs suficientes")
				else if (data.res == "no personaje") mostrarAviso("Ha habido un error de sesión")
				else {
					$.cookie("usr", JSON.stringify(data));
					console.log("Compra ", data)
					//rest.obtenerPersonajes();
					mostrarTienda();
				}
				quitarCargando();
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}

	this.seleccionarPersonaje = function (personaje) {
		mostrarCargando();
		var usr = JSON.parse($.cookie("usr"));
		$.ajax({
			type: 'PUT',
			url: '/seleccionarPersonaje/',
			data: JSON.stringify({ user: usr, personaje: personaje }),
			success: function (data) {
				if (data.res == "personaje no comprado" || data.res == "Error con la cuenta del usuario") {
					mostrarAviso(data.res);
				}
				else {
					$.cookie("usr", JSON.stringify(data));
					console.log("Seleccionar personaje ", data)
					cargarPersonajeSeleccionado();
				}
				quitarCargando();
				$('html,body').animate({ scrollTop: 0 }, 'slow');
			},
			contentType: 'application/json',
			dataType: 'json'
		});
	}

}