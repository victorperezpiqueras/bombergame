
var nick;

function comprobarUsuario() {
	if ($.cookie("usr")) {
		rest.comprobarUsuario();
	}
	else {
		mostrarAgregarUsuario();
	}
}

function mostrarRegistrarUsuario() {
	$('#mAU').remove();
	$('#mLU').remove();
	$('#mRU').remove();
	var cadena = "<div id='mRU'>";
	cadena = cadena + "<h3>Registrar</h3>";
	cadena = cadena + "<div class='row'><div class='col-sm-6' >";
	cadena = cadena + "<div class='form-group'>";
	cadena = cadena + '<input id="nick" type="text" class="form-control" name="nick" placeholder="Nick">';
	cadena = cadena + '<input id="email" type="text" class="form-control" name="email" placeholder="Email">';
	cadena = cadena + '<input id="emailr" type="text" class="form-control" name="emailr" placeholder="Repetir email">';
	cadena = cadena + '<input id="password" type="text" class="form-control" name="password" placeholder="Contraseña">';
	cadena = cadena + '<button class="btn btn-primary" id="registrarBtn" type="submit">Registrar</button>';
	cadena = cadena + "</div>";
	cadena = cadena + "</div></div></div>";
	$('#inicio').append(cadena);

	$('#registrarBtn').on('click', function () {
		var nick = $('#nick').val();
		var email = $('#email').val();
		var emailr = $('#emailr').val();
		var password = $('#password').val();
		rest.registrarUsuario(nick,email,emailr,password);
	});
}
function mostrarLoginUsuario() {
	$('#mAU').remove();
	$('#mLU').remove();
	$('#mRU').remove();
	$('#mCP').remove();
	
	var cadena = "<div id='mLU'>";
	cadena = cadena + "<h3>Login</h3>";
	cadena = cadena + "<div class='row'><div class='col-sm-6' >";
	cadena = cadena + "<div class='form-group'>";
	cadena = cadena + '<input id="nickLogin" type="text" class="form-control" name="nick" placeholder="Nick">';
	cadena = cadena + '<input id="passwordLogin" type="text" class="form-control" name="password" placeholder="Contraseña">';
	cadena = cadena + '<button class="btn btn-primary" id="loginBtn" type="submit">Login</button>';
	cadena = cadena + "</div>";
	cadena = cadena + "</div></div></div>";
	$('#inicio').append(cadena);

	$('#loginBtn').on('click', function () {
		var nick = $('#nickLogin').val();
		var password = $('#passwordLogin').val();		
		rest.loginUsuario(nick,password);
	});
}

function mostrarAgregarUsuario() {//deprecated
	$('#mLP').remove();
	$('#mP').remove();
	$('#mCP').remove();
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
	alert(msg);
	$('#nombre').val("Usa otro nick");
}

function mostrarCrearPartida(nick) {
	$('#mCP').remove();
	$('#mLP').remove();
	$('#mP').remove();
	var cadena = "<div id='mCP'>";
	cadena = cadena + "<h3>Bienvenido " + nick + "</h3>";
	cadena = cadena + '<p><button type="button" id="cerrarSesion" class="btn btn-primary btn-md" onclick="rest.cerrarSesion()">Cerrar sesión</button></p>';
	cadena = cadena + "<div class='row'><div class='col-sm-8'>";
	cadena = cadena + "<h3>Crear Partida</h3>";
	cadena = cadena + '<input id="nombrePartida" type="text" class="form-control" name="nombrePartida" placeholder="Nombre partida">';
	cadena = cadena + '<button type="button" id="crearPartidaBtn" class="btn btn-primary btn-md">Crear partida</button>';
	cadena = cadena + "</div><div class='col-sm-4'><h3>Unirse</h3>";
	cadena = cadena + '<button type="button" id="unirseAPartidaBtn" class="btn btn-primary btn-md">Unirse a partida</button>';
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
	$('#mCP').remove();
	$('#mLP').remove();
	var cadena = "<div id='mP'>";
	cadena = cadena + "<h3>Bienvenido a la partida: " + data.nombre + "</h3>";
	cadena = cadena + '<p><button type="button" id="preparadoBtn" class="btn btn-primary btn-md" onclick="ws.preparado()"">Preparado</button> ';
	cadena = cadena + ' <button type="button" id="salirBtn" class="btn btn-primary btn-md" onclick="ws.salir()"">Salir</button></p></div>';
	$('#inicio').append(cadena);
}

function mostrarListaPartidas(data) {
	$('#mCP').remove();
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
		cadena = cadena + '<td><button type="button" id="unirmeAPartidaBtn" class="btn btn-primary btn-md" onclick="ws.unirAPartida(\'' + data[key].idp + '\',\'' + nick + '\')">Unirse a partida</button></td>';
		cadena = cadena + '</tr>';
	};
	cadena = cadena + "</tbody></table></div>";
	$('#inicio').append(cadena);
}

function mostrarListaJugadores(jugadores) {
	//$('#mCP').remove();
	$('#mLJ').remove();
	//var numeroPartidas=Object.keys(data).length;
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

function mostrarCanvas() {
	$('#mLJ').remove();
	game = new Phaser.Game(240, 240, Phaser.CANVAS, "juego");
	game.state.add("BootState", new Bomberman.BootState());
	game.state.add("LoadingState", new Bomberman.LoadingState());
	game.state.add("TiledState", new Bomberman.TiledState());
	game.state.start("BootState", true, false, "assets/levels/level1.json", "TiledState");
}

function borrarCanvas() {
	$('canvas').remove();
}