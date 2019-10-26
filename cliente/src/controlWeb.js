
var nick;
function mostrarAgregarUsuario(){
	var cadena="<div id='mAU'>";
	cadena=cadena+"<h3>Usuario</h3>";
	cadena=cadena+'<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';		
	cadena=cadena+'<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Iniciar Usuario</button>';	
	cadena=cadena+"</div>";

	$('#inicio').append(cadena);
	$('#inicioBtn').on('click',function(){
        var nombre=$('#nombre').val();
        if (nombre==""){
        	nombre="Neutro";
        }
        rest.agregarUsuario(nombre);
     });
}

function mostrarUsuario(data){
	$('#mAU').remove();
	ws=new ClienteWS(data.nick);
	ws.ini();
	nick=data.nick;
	mostrarCrearPartida(data.nick);
}

function mostrarAviso(msg){
	alert(msg);
	$('#nombre').val("Usa otro nick");
}

function mostrarCrearPartida(nick){
	$('#mLP').remove();
	$('#mP').remove();
	var cadena="<div id='mCP'>";
	cadena=cadena+"<h3>Bienvenido "+nick+"</h3>";
	cadena=cadena+"<div class='row'><div class='col-sm-8'>";
	cadena=cadena+"<h3>Crear Partida</h3>";
	cadena=cadena+'<input id="nombrePartida" type="text" class="form-control" name="nombrePartida" placeholder="Nombre partida">';		
	cadena=cadena+'<button type="button" id="crearPartidaBtn" class="btn btn-primary btn-md">Crear partida</button>';	
	cadena=cadena+"</div><div class='col-sm-4'><h3>Unirse</h3>";
	cadena=cadena+'<button type="button" id="unirseAPartidaBtn" class="btn btn-primary btn-md">Unirse a partida</button>';
	cadena=cadena+"</div>";

	$('#inicio').append(cadena);
	$('#crearPartidaBtn').on('click',function(){
        var nombre=$('#nombrePartida').val();
        if (nombre==""){
        	nombre="SinNombre";
        }
        //rest.crearPartida(nombre,nick);
        ws.crearPartida(nombre);
     });
	$('#unirseAPartidaBtn').on('click',function(){
        //rest.obtenerPartidas();
        ws.obtenerPartidas();
     });

}

function mostrarPartida(data){
	$('#mCP').remove();
	$('#mLP').remove();
	var cadena="<div id='mP'>";
	cadena=cadena+"<h3>Bienvenido a la partida: "+data.nombre+"</h3>";
	cadena=cadena+'<p><button type="button" id="salirBtn" class="btn btn-primary btn-md" onclick="ws.salir()"">Salir</button></p></div>';
	$('#inicio').append(cadena);
}

function mostrarListaPartidas(data){
	$('#mCP').remove();
	var numeroPartidas=Object.keys(data).length;
	var cadena="<div id='mLP'>";
	cadena=cadena+"<h3>Lista de partidas</h3>";
	//cadena=cadena+'<ul class="list-group">';
  	cadena=cadena+'<table class="table"><thead><tr>';
    cadena=cadena+'<th scope="col">Nombre</th><th scope="col">Número jugadores</th><th>Unirse</th>';
    cadena=cadena+'</tr></thead>';
    cadena=cadena+'<tbody>';
  	for(var key in data){
  		cadena=cadena+'<tr>'
  		cadena=cadena+'<td>'+data[key].nombre+'</td>';
  		cadena=cadena+'<td>'+Object.keys(data[key].jugadores).length+'</td>';
 		cadena=cadena+'<td><button type="button" id="unirmeAPartidaBtn" class="btn btn-primary btn-md" onclick="ws.unirAPartida(\''+data[key].idp+'\',\''+nick+'\')">Unirse a partida</button></td>';
 		cadena=cadena+'</tr>';
  	};
  	cadena=cadena+"</tbody></table></div>";
  	$('#inicio').append(cadena);
}

function mostrarListaJugadores(jugadores){
	//$('#mCP').remove();
	$('#mLJ').remove();
	//var numeroPartidas=Object.keys(data).length;
	var cadena="<div id='mLJ'>";
	cadena=cadena+"<h3>Lista de jugadores</h3>";
  	cadena=cadena+'<table class="table"><thead><tr>';
    cadena=cadena+'<th scope="col">Nick</th><th scope="col">Vidas</th><th>Otros</th>';
    cadena=cadena+'</tr></thead>';
    cadena=cadena+'<tbody>';
  	for(var key in jugadores){
  		cadena=cadena+'<tr>'
  		cadena=cadena+'<td>'+jugadores[key].nick+'</td>';
  		cadena=cadena+'<td>-</td>';
 		cadena=cadena+'<td>Preparado</td>';
 		cadena=cadena+'</tr>';
  	};
  	cadena=cadena+"</tbody></table></div>";
  	$('#mP').append(cadena);
}