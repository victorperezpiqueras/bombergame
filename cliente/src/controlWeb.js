var usuario;
function mostrarAgregarUsuario() {
    var cadena = '<div id="mAU">';
    cadena = cadena + '<h3>Usuario</h3>';
    cadena = cadena + '<hr>';
    cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
    cadena = cadena + '<br>';
    cadena = cadena + '<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Entrar</button>';
    cadena = cadena + '</div>';

    //#id, .clase, htmltype
    $('#inicio').append(cadena);
    $('#inicioBtn').on('click', function () {
        var nombre = $('#nombre').val();
        if (nombre == "") {
            nombre = "player";
        }
        rest.agregarUsuario(nombre);

    });

}

function mostrarPartida(partida) {
    $('#bienvenido').remove();
    $('#listaPartidas').remove();
    cadena = '<div id="bienvenido">';
    cadena = cadena + '<h4>Bienvenido a la partida ' + partida.nombre + '!</h4>';
    cadena = cadena + '<hr>';
    cadena = cadena + '</div>';
    $('#welcome').append(cadena);
}

function mostrarUsuario(usuario) {
    var cadena;
    this.usuario = usuario;
    cadena = '<div id="bienvenido">';
    cadena = cadena + '<h4>Bienvenido ' + usuario.nick + '!</h4>';
    cadena = cadena + '<hr>';
    cadena = cadena + '</div>';
    $('#welcome').append(cadena);
    $('#mAU').remove();
    ws = new ClienteWS(usuario.nick);
    ws.ini();
    mostrarCrearPartida(usuario);
    mostrarListaPartidas();
    //rest.obtenerPartidas();////////////////////
}


function mostrarErrorUsuario() {
    $('#userExists').remove();
    console.log("usuario ya existe");
    cadena = '<div id="userExists">';
    cadena = cadena + '<h6 style="color:red;">El usuario ya existe</h6>';
    cadena = cadena + '</div>';
    $('#mAU').append(cadena);
    $('#nombre').val("");
    //alert("aaaa");
}

function mostrarCrearPartida(usuario) {
    var cadena = '<div id="mostrarCrearPartida" class="col-sm">';
    cadena = cadena + '<h4>Crear Partida</h4>';
    cadena = cadena + '<hr>';
    cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre partida">';
    cadena = cadena + '<br>';
    cadena = cadena + '<button type="button" id="crearPartidaBtn" class="btn btn-danger btn-md" >Crear partida</button>';
    cadena = cadena + '</div>';
    $('#inicio').append(cadena);
    $('#crearPartidaBtn').on('click', function () {
        var nombre = $('#nombre').val();
        if (nombre == "") {
            nombre = "partida";
        }
        //rest.crearPartida(nombre, usuario.nick);
        ws.crearPartida(nombre);
    });

}



function mostrarListaPartidas() {
    $('#listaJugadores').remove();
    var cadena = '<div id="unirseAPartida" class="col-sm">';
    cadena = cadena + '<h4>Unirse a Partida</h4>';
    cadena = cadena + '<hr>';
    cadena = cadena + '<button type="button" id="verPartidas" class="btn btn-primary btn-md" >Ver partidas</button>';
    cadena = cadena + '<hr>';
    cadena = cadena + '</div>';
    $('#inicio').append(cadena);
    $('#verPartidas').on('click', function () {
        mostrarUnirseAPartida();
    });
}

function mostrarUnirseAPartida() {
    //$('#mostrarCrearPartida').remove();
    rest.obtenerPartidas();////////////////////
}


function mostrarObtenerPartidas(partidas) {
    //$('#verPartidas').remove();
    $('#listaPartidas').remove();
    var cadena = '<div id="listaPartidas" class="col-sm">';

    cadena = cadena + '<h4>Lista de Partidas</h4>';
    cadena = cadena + '<table class="table">';
    cadena = cadena + '<thead>';
    cadena = cadena + '<tr>';
    cadena = cadena + '<th scope="col">Nombre</th>';
    cadena = cadena + '<th scope="col">Jugadores</th>';
    cadena = cadena + '<th scope="col">Unirse</th>';
    cadena = cadena + '</tr>';
    cadena = cadena + '</thead>';
    cadena = cadena + '<tbody>';
    for (var index in partidas) {
        cadena = cadena + '<tr>';
        cadena = cadena + '<td scope="row">' + partidas[index].nombre + '</td>';
        cadena = cadena + '<td>' + Object.keys(partidas[index].jugadores).length + '</td>';
        cadena = cadena + '<td>';
        //cadena = cadena + '<button type="button" id="unirsePartidaBtn" class="btn btn-primary btn-md" onclick="rest.unirAPartida(\''+partidas[index].idp+'\',\''+this.usuario.nick+'\')">Unirse</button>';
        cadena = cadena + '<button type="button" id="unirsePartidaBtn" class="btn btn-primary btn-md" onclick="ws.unirAPartida(\'' + partidas[index].idp + '\',\'' + this.usuario.nick + '\')">Unirse</button>';
        cadena = cadena + '</td>';
        cadena = cadena + '</tr>';
    }

    cadena = cadena + '</tbody>';
    cadena = cadena + '</table>';
    cadena = cadena + '</div>';
    $('#unirseAPartida').append(cadena);
}


function mostrarListaJugadores(jugadores) {
    $('#mostrarCrearPartida').remove();
    $('#unirseAPartida').remove();
    $('#listaPartidas').remove();
    $('#listaJugadores').remove();
    var cadena = '<div id="listaJugadores" class="col-sm">';

    cadena = cadena + '<h4>Lista de Jugadores</h4>';
    cadena = cadena + '<table class="table">';
    cadena = cadena + '<thead>';
    cadena = cadena + '<tr>';
    cadena = cadena + '<th>Nick</th>';
    cadena = cadena + '<th>Vidas</th>';
    cadena = cadena + '<th>Listo</th>';
    cadena = cadena + '</tr>';
    cadena = cadena + '</thead>';
    cadena = cadena + '<tbody>';
    for (var index in jugadores) {
        cadena = cadena + '<tr>';
        cadena = cadena + '<td>' + jugadores[index].nick + '</td>';
        cadena = cadena + '<td></td>';
        cadena = cadena + '<td>Preparado</td>';
        cadena = cadena + '</tr>';
    }

    cadena = cadena + '</tbody>';
    cadena = cadena + '</table>';
    cadena = cadena + '<button type="button" id="salirPartidaBtn" class="btn btn-primary btn-md" onclick="ws.salirPartida()">Salir</button>';
    cadena = cadena + '</div>';
    $('#inicio').append(cadena);
}

