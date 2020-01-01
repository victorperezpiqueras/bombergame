function generarMensaje() {
    const mensajes = [
        "Encontrar un bug = +1 cerveza",
        "Venga gallud dame la matricula porfa",
        "A prueba de XSS (espero)",
        "El juego que enganchó a Kent Beck",
        "El código será malo pero mira como se deslizan las cosas",
        "Socorro me tienen encerrado escribiendo frases aleatorias",
        "Echa un ojo a los enlaces de abajo ;)",
        "Aprobado por la ISO 25022:2011",
        "Mi madre dice que está muy bien",
        "Feliz 2020 y suerte con distribuidos",
        "Cuidado con los altavoces que los sonidos no van muy bien"
    ];
    const index = Math.floor(Math.random() * 11);
    $("#mensaje-del-dia").fadeOut(function() {
        $(this).text(mensajes[index])
      }).fadeIn();
}