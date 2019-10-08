var modelo = require("./modelo.js");

describe("Bombergame", function () {
    var juego;
    var inicial;

    beforeEach(function () {
        juego = new modelo.Juego();
        //Inicial = new modelo.Inicial();
    });

    it("comprobaciones iniciales", function () {
        expect(Object.keys(juego.usuarios).length).toEqual(0);
        expect(Object.keys(juego.partidas).length).toEqual(0);

    });

    it("agregar usuarios al juego", function () {
        juego.agregarUsuario("pepe", function(){});
        expect(Object.keys(juego.usuarios).length).toEqual(1);
        juego.agregarUsuario("pepa", function(){});
        expect(Object.keys(juego.usuarios).length).toEqual(2);

        expect(Object.keys(juego.usuarios["pepe"])).not.toBe(undefined);
        //expect(Object.keys(juego.usuarios["pepe"]).nick ).toBe("pepe");
    });

    it("comprobar partida", function () {
        juego.agregarUsuario('pepe', function(){});
        juego.crearPartida('partida', 'pepe', function(usr){});
        expect(Object.keys(juego.partidas).length).toEqual(1);
        expect(juego.partidas['partidapepe']).not.toBe(undefined);
        expect(juego.usuarios['pepe'].nick).toEqual("pepe");
    });

    it("unirse a partida agrega jugadores", function () {
        juego.agregarUsuario('pepe', function(){});
        juego.agregarUsuario('pepa', function(){});
        juego.crearPartida('partida', 'pepe', function(){});
        juego.unirAPartida('partidapepe', 'pepa', function(){});
        expect(Object.keys(juego.partidas['partidapepe'].jugadores).length).toEqual(2);
        expect(juego.partidas['partidapepe'].jugadores['pepa'].nick).toBe("pepa");
    });

    it("partida en fase inicial", function () {
        juego.agregarUsuario('pepe', function(){});
        juego.crearPartida('partida', 'pepe', function(){});
        expect(juego.partidas['partidapepe'].fase.nombre).toEqual("inicial");
        //probar a comprobar la clase del objeto fase
        //expect(juego.partidas['partidapepe'].fase instanceof Inicial).toBeTruthy();
    });

    it("salir de partida de 2 jugadores quita el jugador", function () {
        juego.agregarUsuario('pepe', function(){});
        juego.agregarUsuario('pepa', function(){});
        juego.crearPartida('partida', 'pepe', function(){});
        juego.unirAPartida('partidapepe', 'pepa', function(){});
        expect(Object.keys(juego.partidas['partidapepe'].jugadores).length).toEqual(2);
        juego.salir('partidapepe', 'pepa');
        expect(Object.keys(juego.partidas['partidapepe'].jugadores).length).toEqual(1);
    });

    it("salir de partida de 1 jugador quita el jugador y borra la partida", function () {
        juego.agregarUsuario('pepe', function(){});
        juego.crearPartida('partida', 'pepe', function(){});
        expect(Object.keys(juego.partidas).length).toEqual(1);
        expect(Object.keys(juego.partidas['partidapepe'].jugadores).length).toEqual(1);
        juego.salir('partidapepe', 'pepe');
        expect(Object.keys(juego.partidas).length).toEqual(0);
    });



});
