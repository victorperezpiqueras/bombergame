
function mostrarListaPartidas(data){
	var cadena="<div id='mLP'>";

	cadena=cadena+'<table class="table"><thead><tr>';
	cadena=cadena+'<th scope="col">Nombre partida</th><th scope="col">Número de jugadores</th><th scope="col">Unirme</th></tr></thead>';
	cadena=cadena+'<tbody>';

	for (var key in data) {
		cadena=cadena+'<tr>';
    	cadena=cadena+'<td>'+data[key].nombre+'</td>';
		cadena=cadena+'<td>'+data[key].nombre+'</td>';
		cadena=cadena+'<td>'+data[key].nombre+'</td>';
		cadena=cadena+'</tr>';
	}
	cadena=cadena+'</tbody></table>';
}