describe("Bombergame", function () {
    var juego;

    beforeEach(function () {
        juego = new Juego();
    });

    it("comprobaciones iniciales", function () {
        expect(Object.keys(juego.usuarios).length).toEqual(0);
        expect(Object.keys(juego.partidas).length).toEqual(0);

    });

    it("agregar usuarios", function () {
        juego.agregarUsuario("pepe");
        expect(Object.keys(juego.usuarios).length).toEqual(1);
        juego.agregarUsuario("pepa");
        expect(Object.keys(juego.usuarios).length).toEqual(2);

        expect(Object.keys(juego.usuarios["pepe"])).not.toBe(undefined);
        //expect(Object.keys(juego.usuarios["pepe"]).nick ).toBe("pepe");
    });

    it("comprobar partida", function () {
        juego.agregarUsuario('pepe');
        juego.agregarUsuario('pepa');
        juego.crearPartida('partida', 'pepe');
        expect(Object.keys(juego.partidas).length).toEqual(1);
        expect(juego.partidas['partidapepe']).not.toBe(undefined);

        //expect(Object.keys(juego.usuarios)['pepe'].nick).toEqual("pepe");
    });

    it("unirse a partida", function () {
        juego.agregarUsuario('pepe');
        juego.agregarUsuario('pepa');
        juego.crearPartida('partida', 'pepe');
        juego.unirAPartida('partidapepe','pepa');
        expect(Object.keys( juego.partidas['partidapepe'].jugadores ).length).toEqual(2);
        expect(juego.partidas['partidapepe'].jugadores['pepa'].nick).toBe("pepa");

        //expect(Object.keys(juego.usuarios)['pepe'].nick).toEqual("pepe");
    });



});
