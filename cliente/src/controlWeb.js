
function mostrarAgregarUsuario() {
    var cadena = '<div id="mAU">';
    cadena = cadena + '<h3>Usuario</h3>';
    cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
    cadena = cadena + '<br>';
    cadena = cadena + '<button type="button" id="inicioBtn" class="btn btn-primary btn-md" >Iniciar Usuario</button>';
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

function mostrarUsuario(){
    $('#mAU').remove();
}

function mostrarAgregarUsuario2() {
    var cadena = '<div class="form-group">';
    cadena = cadena + '<label for="usr">Name:</label>';
    cadena = cadena + '<input type="text" class="form-control" id="usr">';
    cadena = cadena + '</div>';
    cadena = cadena + '<div class="form-group">';
    cadena = cadena + ' <label for="pwd">Password:</label>';
    cadena = cadena + ' <input type="password" class="form-control" id="pwd">';
    cadena = cadena + ' </div> ';

    $('#inicio').append(cadena);
}
