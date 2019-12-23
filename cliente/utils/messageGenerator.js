function generarMensaje() {
    var mensajes = [
        "Encontrar un bug = una cerveza",
        "Venga gallud dame la matricula porfa",
        "A prueba de XSS (espero)",
        "El juego que enganchó a Kent Beck",
        "El codigo será malo pero mira como se deslizan las cosas",
        "Socorro me tienen encerrado escribiendo frases aleatorias",
        "Echa un ojo a los enlaces de abajo ;)",
        "Aprobado por la ISO 25022:2011",
        "Mi madre dice que está muy bien"
    ];
    var index = Math.floor(Math.random() * 9);
    $('#mensaje-del-dia').text(mensajes[index]);
}