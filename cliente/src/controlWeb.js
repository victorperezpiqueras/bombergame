
var nick;
var inGame = false;

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
		mostrarCrearPartida();
	}
	else {
		mostrarAviso("Debes iniciar sesión");
		mostrarLoginUsuario();
	}
}

function mostrarTutorial() {
	clear();
	checkInGame();
	generarMensaje();
	mostrarNavLogged();
	$(document).ready(function () {
		$('#inicio').load('tutorial/tutorial.html');
	});
}
function mostrarRegistrarUsuario() {
	clear();
	generarMensaje();
	mostrarNavDefault();
	$(document).ready(function () {
		$('#inicio').load('login/registro.html');
	});
}
function mostrarLoginUsuario() {
	clear();
	generarMensaje();
	mostrarNavDefault();
	$(document).ready(function () {
		$('#inicio').load('login/login.html');
	});
}
function mostrarCuentaUsuario() {
	clear();
	checkInGame();
	generarMensaje();
	mostrarNavLogged();
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
	mostrarCrearPartida(data.nick);
}

function mostrarAviso(msg) {
	/* alert(msg);
	$('#nombre').val("Usa otro nick"); */
	$.alert(msg, "Error");
}

function mostrarCrearPartida(nick) {
	clear();
	checkInGame();
	generarMensaje();
	mostrarNavLogged();
	$(document).ready(function () {
		$('#inicio').load('partida/crearPartida.html');
	});
}

function mostrarPartida(data) {
	clear();
	var cadena = "<div id='mP'>";
	cadena = cadena + "<h3>Bienvenido a la partida: " + data.nombre + "</h3><hr>";
	cadena = cadena + '<div class="col-12 col-sm-6 col-md-6 inline" id="in-partida-div">';
	cadena = cadena + '<button type="button" id="preparadoBtn" class="btn btn-md inline login50-form-btn1" onclick="ws.preparado()"">PREPARADO</button>&nbsp;';
	cadena = cadena + ' <button type="button" id="salirBtn" class="btn btn-md inline login50-form-btn1" onclick="ws.salir()"">SALIR</button><br><br></div></div><hr>';
	$('#inicio').append(cadena);
	/* $(document).ready(function () {
		$('#inicio').load('partida/mostrarPartida.html');
	}); */
}

function mostrarListaJugadores(jugadores) {
	$('#mLJ').remove();
	var cadena = "<div id='mLJ'>";
	cadena = cadena + "<h3>Lista de jugadores</h3><hr>";
	cadena = cadena + '<table class="table table-striped shadow p-4 mb-4 bg-white rounded animated bounceInUp"><thead class="thead-dark"><tr>';
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

function mostrarListaPartidas(data) {
	clear();
	var numeroPartidas = Object.keys(data).length;
	var cadena = "<div id='mLP'>";
	cadena = cadena + "<h3>Lista de partidas</h3><hr>";
	//cadena=cadena+'<ul class="list-group">';
	cadena = cadena + '<table class="table table-striped shadow p-4 mb-4 bg-white rounded animated bounceInUp"><thead class="thead-dark"><tr>';
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
	cadena = cadena + "</tbody></table>";
	cadena = cadena + "<button type='button' id='salirBtn' class='btn login50-form-btn btn-md animated bounceInUp' onclick='mostrarCrearPartida()'>Volver</button></div>";
	$('#inicio').append(cadena);
}


function mostrarResultados(data) {
	clear();
	checkInGame();
	generarMensaje();
	var numeroPartidas = Object.keys(data).length;
	var cadena = "<div id='mLR'>";
	cadena = cadena + "<h3>RESULTADOS</h3><hr>";
	//cadena=cadena+'<ul class="list-group">';
	cadena = cadena + '<table id="tabla-resultados" class="table table-striped shadow p-4 mb-4 bg-white animated bounceInDown"><thead class="thead-dark"><tr>';
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

	/* sorting de la tabla */
	$(document).ready(function () {
		$('#tabla-resultados').DataTable({
			"paging": false,
			"searching": false,
			"info": false
		});
		$('.dataTables_length').addClass('bs-select');
	});
}

function mostrarCanvas(num) {
	inGame = true;
	console.log(num);
	$('#mLJ').remove();
	//$('#inicio').append("<h1 id='contador-vidas'>Vidas: 3</h1>");
	$('#inicio').append(/* "<h3 class='d-inline'>Vidas: </h3> */
	"<img id='contador-vidas' class='contadorVidas d-inline' src='assets/images/3vida.png'/><br>");
	$('html,body').animate({ scrollTop: 9999 }, 'slow');
	
	game = new Phaser.Game(240, 240, Phaser.CANVAS, "juego");
	game.state.add("BootState", new Bomberman.BootState());
	game.state.add("LoadingState", new Bomberman.LoadingState());
	game.state.add("TiledState", new Bomberman.TiledState());

	game.state.start("BootState", true, false, "assets/levels/level1_" + num + "player.json", "TiledState");
	console.log("assets/levels/level1_" + num + "player.json");

}

function borrarCanvas() {
	inGame = false;
	$('canvas').remove();
	$('#contador-vidas').remove();
}

function checkInGame() {
	if (inGame) ws.salir();
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
	//var cadena='<img src="../assets/images/bombload.gif"/>'
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

function actualizarVidas(numVidas){
	$("#contador-vidas").effect( "bounce", {times:3}, 300 );
	$('#contador-vidas').attr("src","assets/images/"+numVidas+"vida.png");
}