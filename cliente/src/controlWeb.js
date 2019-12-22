
var nick;

function comprobarUsuario() {
	if ($.cookie("usr")) {
		rest.comprobarUsuario();
	}
	else {
		mostrarAgregarUsuario();
	}
}

function mostrarInicio() {
	clear();
	if ($.cookie("usr")) {
		$(document).ready(function () {
			$('#inicio').load('perfil/perfil.html');
		});
	}
	else {
		mostrarAviso("Debes iniciar sesión");
		mostrarLoginUsuario();
	}
}

function mostrarTutorial() {
	clear()
	$(document).ready(function () {
		$('#inicio').load('tutorial/tutorial.html');
	});
}
function mostrarRegistrarUsuario() {
	clear();
	mostrarNavDefault();
	$(document).ready(function () {
		$('#inicio').load('login/registro.html');
	});
}
function mostrarLoginUsuario() {
	clear();
	mostrarNavDefault();
	$(document).ready(function () {
		$('#inicio').load('login/login.html');
	});

}
function mostrarCuentaUsuario() {
	clear();
	$(document).ready(function () {
		$('#inicio').load('perfil/perfil.html');
	});
}

function mostrarNavLogged() {
	$('#nav-default').remove();
	$(document).ready(function () {
		$('#navbar-main').load('nav/nav-logged.html');
	});
}
function mostrarNavDefault() {
	$('#nav-logged').remove();
	$(document).ready(function () {
		$('#navbar-main').load('nav/nav-default.html');
	});
}

function mostrarAgregarUsuario() {//deprecated
	clear();
	var cadena = "<div id='mAU'>";
	cadena = cadena + "<h3>Usuario</h3>";
	cadena = cadena + "<div class='row'><div class='col-sm-6'>";
	cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
	cadena = cadena + "</div><div class='col-sm-6'>"
	cadena = cadena + '<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Iniciar Usuario</button>';
	cadena = cadena + "</div></div>";

	$('#inicio').append(cadena);
	$('#inicioBtn').on('click', function () {
		var nombre = $('#nombre').val();
		if (nombre == "") {
			nombre = "Neutro";
		}
		rest.agregarUsuario(nombre);
	});
}

function mostrarUsuario(data) {
	$('#mAU').remove();
	$('#mLU').remove();
	$('#mRU').remove();
	ws = new ClienteWS(data.nick);
	ws.ini();
	nick = data.nick;
	mostrarNavLogged();
	mostrarCrearPartida(data.nick);
}

function mostrarAviso(msg) {
	alert(msg);
	$('#nombre').val("Usa otro nick");
}

function mostrarCrearPartida(nick) {
	clear();
	var nick = JSON.parse($.cookie("usr")).nick;
	var cadena = "<div id='mCP'>";
	cadena = cadena + "<h3 class='titles'>Bienvenido " + nick + "</h3>";
	cadena = cadena + '<p><button type="button" id="cerrarSesion" class="btn btn-md login50-form-btn" onclick="rest.cerrarSesion()">Cerrar sesión</button></p>';
	cadena = cadena + '<br>';
	cadena = cadena + "<div class='row'><div class='col-sm-8'>";
	cadena = cadena + "<h3 class='titles'>Crear Partida</h3>";
	cadena = cadena + '<input id="nombrePartida" type="text" class="form-control" name="nombrePartida" placeholder="Nombre partida">';
	cadena = cadena + '<br>';
	cadena = cadena + '<button type="button" id="crearPartidaBtn" class="btn  btn-md login50-form-btn">Crear partida</button>';
	cadena = cadena + "</div><div class='col-sm-4'><h3 class='titles'>Unirse</h3>";
	cadena = cadena + '<button type="button" id="unirseAPartidaBtn" class="btn  btn-md login50-form-btn">Unirse a partida</button>';
	cadena = cadena + "</div></div>";

	$('#inicio').append(cadena);
	$('#crearPartidaBtn').on('click', function () {
		var nombre = $('#nombrePartida').val();
		if (nombre == "") {
			nombre = "SinNombre";
		}
		//rest.crearPartida(nombre,nick);
		ws.crearPartida(nombre);
	});
	$('#unirseAPartidaBtn').on('click', function () {
		//rest.obtenerPartidas();
		ws.obtenerPartidas();
	});

}

function mostrarPartida(data) {
	clear();
	var cadena = "<div id='mP'>";
	cadena = cadena + "<h3>Bienvenido a la partida: " + data.nombre + "</h3>";
	cadena = cadena + '<div class="row">';
	cadena = cadena + '<p><button type="button" id="preparadoBtn" class="btn login50-form-btn btn-md" onclick="ws.preparado()"">Preparado</button><br> ';
	cadena = cadena + ' <button type="button" id="salirBtn" class="btn login50-form-btn btn-md" onclick="ws.salir()"">Salir</button></p><br></div></div>';
	$('#inicio').append(cadena);
}

function mostrarListaPartidas(data) {
	clear();
	var numeroPartidas = Object.keys(data).length;
	var cadena = "<div id='mLP'>";
	cadena = cadena + "<h3>Lista de partidas</h3>";
	//cadena=cadena+'<ul class="list-group">';
	cadena = cadena + '<table class="table"><thead><tr>';
	cadena = cadena + '<th scope="col">Nombre</th><th scope="col">Número jugadores</th><th>Unirse</th>';
	cadena = cadena + '</tr></thead>';
	cadena = cadena + '<tbody>';
	for (var key in data) {
		cadena = cadena + '<tr>'
		cadena = cadena + '<td>' + data[key].nombre + '</td>';
		cadena = cadena + '<td>' + Object.keys(data[key].jugadores).length + '</td>';
		cadena = cadena + '<td><button type="button" id="unirmeAPartidaBtn" class="btn login50-form-btn btn-md" onclick="ws.unirAPartida(\'' + data[key].idp + '\',\'' + nick + '\')">Unirse a partida</button></td>';
		cadena = cadena + '</tr>';
	};
	cadena = cadena + "</tbody></table></div>";
	$('#inicio').append(cadena);
}

function mostrarListaJugadores(jugadores) {
	$('#mLJ').remove();
	var cadena = "<div id='mLJ'>";
	cadena = cadena + "<h3>Lista de jugadores</h3>";
	cadena = cadena + '<table class="table"><thead><tr>';
	cadena = cadena + '<th scope="col">Nick</th><th scope="col">Vidas</th><th>Otros</th>';
	cadena = cadena + '</tr></thead>';
	cadena = cadena + '<tbody>';
	for (var key in jugadores) {
		cadena = cadena + '<tr>'
		cadena = cadena + '<td>' + jugadores[key].nick + '</td>';
		cadena = cadena + '<td>-</td>';
		cadena = cadena + '<td>' + jugadores[key].estado + '</td>';
		cadena = cadena + '</tr>';
	};
	cadena = cadena + "</tbody></table></div>";
	$('#mP').append(cadena);
}

function mostrarResultados(data) {
	clear();
	var numeroPartidas = Object.keys(data).length;
	var cadena = "<div id='mLR'>";
	cadena = cadena + "<h3>RESULTADOS</h3><hr>";
	//cadena=cadena+'<ul class="list-group">';
	cadena = cadena + '<table class="table table-striped shadow p-4 mb-4 bg-white"><thead class="thead-dark"><tr>';
	cadena = cadena + '<th scope="col">Partida</th><th scope="col">Ganador</th><th>Nivel</th><th>Jugadores</th>';
	cadena = cadena + '</tr></thead>';
	cadena = cadena + '<tbody>';
	for (var key in data) {
		cadena = cadena + '<tr>'
		cadena = cadena + '<td>' + data[key].nombrePartida + '</td>';
		cadena = cadena + '<td>' + data[key].nickGanador + '</td>';
		cadena = cadena + '<td>' + data[key].nivel + '</td>';
		cadena = cadena + '<td>';
		for (var i = 0; i < Object.keys(data[key].jugadores).length; i++) {
			cadena = cadena + data[key].jugadores[i];
			if (i + 1 < Object.keys(data[key].jugadores).length) cadena = cadena + ', ';
		}
		cadena = cadena + '</td>';
		cadena = cadena + '</tr>';
	};
	cadena = cadena + "</tbody></table>";
	cadena = cadena + "<button type='button' id='salirBtn' class='btn login50-form-btn btn-md' onclick='mostrarCrearPartida()'>Volver</button></div>";
	$('#inicio').append(cadena);
}

function mostrarCanvas(num) {
	console.log(num);
	$('#mLJ').remove();
	game = new Phaser.Game(240, 240, Phaser.CANVAS, "juego");
	game.state.add("BootState", new Bomberman.BootState());
	game.state.add("LoadingState", new Bomberman.LoadingState());
	game.state.add("TiledState", new Bomberman.TiledState());

	game.state.start("BootState", true, false, "assets/levels/level1_" + num + "player.json", "TiledState");
	console.log("assets/levels/level1_" + num + "player.json");
}

function borrarCanvas() {
	$('canvas').remove();
}

function clear() {
	$('#mAU').remove();
	$('#mLU').remove();
	$('#mRU').remove();
	$('#mCP').remove();
	$('#mPJ').remove();
	$('#mT').remove();

	$('#mLP').remove();
	$('#mLR').remove();
	$('#mP').remove();
}

function mostrarCargando() {
	var cadena = '<div id="loading" class="spinner-border text-secondary loading text-center" role="status">';
	cadena = cadena + '<span class="sr-only">Loading...</span></div>';
	$('#main-container').append(cadena);
}
function quitarCargando() {
	$('#loading').remove();
}

function mostrarPartidasGanadas(stats) {
	$('#cuenta-partidas-ganadas').text("Partidas ganadas: " + stats.partidasGanadas);
	$('#cuenta-partidas-jugadas').text("Partidas jugadas: " + stats.partidasJugadas);
	$('#cuenta-partidas-ratio').text("Ratio de victoria: " + stats.ratio);
}