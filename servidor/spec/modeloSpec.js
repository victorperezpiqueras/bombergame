var modelo = require("../modelo.js");
var cifrado = require("../cifrado.js");

describe("usuarios", function () {
  var juego;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  beforeEach(function (done) {
    juego = new modelo.Juego();
    juego.obtenerUsuarioNick("test", function (usr) {
      if (usr) {
        juego.eliminarUsuario(usr._id, function () {
          done();
        });
      }
      else {
        done();
      }
    });
  });

  // CUENTAS DE USUARIO:
  it("registrar usuario", function (done) {
    console.log("------registrar usuario------");
    const user = { email: "test@test", nick: "test", password: "test" };
    juego.registrarUsuario(user, function (res) {
      expect(res.nick).toEqual("test");
      expect(res.email).toEqual("test@test");
      expect(res.password).toEqual(cifrado.encrypt("test"));
      done();
    });
  });

  it("loguear usuario", function (done) {
    console.log('------loguear usuario------');
    juego.registrarUsuario({ email: "test@test", nick: "test", password: "test" }, function (res) {
      const user = { nick: "test", password: "test" };
      juego.loginUsuario(user, function (res) {
        expect(res.nick).toEqual("test");
        expect(res.email).toEqual("test@test");
        done();
      });
    });
  });

  it("eliminar usuario", function (done) {
    console.log('------eliminar usuario------');
    const user = { email: "test@test", nick: "test", password: "test" };
    juego.registrarUsuario(user, function (res) {
      juego.eliminarUsuario(res._id, function (res3) {
        expect(parseInt(res3.resultados)).toEqual(1);
        done();
      })
    });
  });

  it("actualizar email usuario", function (done) {
    console.log('------actualizar email usuario------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const newEmail = "test2@test";
    juego.registrarUsuario(user, function (res) {
      juego.actualizarDatosUsuario({ _id: res._id, email: newEmail }, function (res2) {
        expect(res2.email).toEqual(newEmail);
        done();
      })
    });
  });

  it("actualizar password usuario", function (done) {
    console.log('------actualizar password usuario------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const newPassword = "newPassword";
    juego.registrarUsuario(user, function (res) {
      juego.actualizarUsuario({ uid: res._id, oldpass: "test", newpass: newPassword }, function (res2) {
        expect(cifrado.decrypt(res2.password)).toEqual(newPassword);
        done();
      })
    });
  });

  //RESULTADOS:
  it("insertar resultado", function (done) {
    const resultado = new modelo.Resultado("ganador", "partida", "1", ["ganador"], 200);
    const partida = new modelo.Partida("partida", "1");
    partida.nickGanador = "ganador";
    partida.jugadores = ["ganador"];
    partida.puntos = 200;
    juego.obtenerResultados(function (res) {
      var numRes = res.length; //contar resultados antes:
      juego.anotarResultado(partida, "ganador", function () { //anotar resultado
        juego.obtenerResultadosNick("ganador", function (res) { //obtenerlo y comprobarlo
          expect(res.nickGanador).toEqual(resultado.nickGanador);
          expect(res.nombre).toEqual(resultado.nombre);
          expect(res.nivel).toEqual(parseInt(resultado.nivel));
          expect(res.jugadores.length).toEqual(resultado.jugadores.length);//hay un resultado insertado                           
          juego.eliminarResultado(res._id, function (res) {//eliminarlo
            expect(parseInt(res.resultados)).toEqual(1);    //ok
            juego.obtenerResultados(function (res) {
              expect(res.length).toBe(numRes);           //comprobar que se ha borrado
              done();
            })
          })
        })
      })
    })
  });

  //PERSONAJES:
  it("generar y comprobar personajes", function (done) {
    console.log('------generar y comprobar personajes------');
    juego.eliminarPersonajes(function (res) { //eliminarlos
      juego.generarPersonajes(function (res) {    //volver a generarlos
        juego.obtenerPersonajes(function (pers) {   //comprobar que hay 5
          expect(pers.length).toBe(5);
          done();
        })
      });
    });
  });

  it("pagar personaje", function (done) {
    console.log('------pagar personajes------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const puntos = 2000;
    const expectedDinero = 200;
    juego.registrarUsuario(user, function (res) {
      expect(res.dinero).toBe(0);
      juego.aumentarDinero(res.nick, puntos, function (res2) {
        expect(res2.dinero).toBe(expectedDinero); //suma puntos/10
        done();
      });
    });
  });

  it("comprar personaje", function (done) {
    console.log('------comprar personajes------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const datosPersonaje = { nombre: "Enemigo", precio: 100 };    //personaje a comprar
    juego.registrarUsuario(user, function (res) {
      expect(res.dinero).toBe(0);     //comprobar dinero inicial
      juego.aumentarDinero(res.nick, 10000, function (res2) {
        juego.comprarPersonaje(res, datosPersonaje.nombre, function (res3) {    //comprar personaje
          expect(res3.dinero).toBe(res2.dinero - datosPersonaje.precio);  //comprobar dinero
          expect(res3.personajes.length).toBe(2);             //comprobar lista de personajes del usuario
          expect(res3.personajes[1].nombre).toBe(datosPersonaje.nombre);
          done();
        })
      });
    });
  });

  it("no dinero - comprar personaje", function (done) {
    console.log('------no dinero - comprar personajes------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const datosPersonaje = { nombre: "Enemigo", precio: 100 };    //personaje a comprar
    juego.registrarUsuario(user, function (res) {
      expect(res.dinero).toBe(0);     //comprobar dinero inicial
      juego.comprarPersonaje(res, datosPersonaje.nombre, function (res3) {   //comprar personaje
        expect(res3.res).toBe("no dinero");  //comprobar resultado
        done();
      })
    });
  });

  it("personaje ya comprado - comprar personaje", function (done) {
    console.log('------personaje ya comprado - comprar personaje------');
    const user = { email: "test@test", nick: "test", password: "test" };
    const datosPersonaje = { nombre: "Enemigo", precio: 100 };    //personaje a comprar
    juego.registrarUsuario(user, function (res) {
      expect(res.dinero).toBe(0);     //comprobar dinero inicial
      juego.aumentarDinero(res.nick, 10000, function (res2) {
        juego.comprarPersonaje(res2, datosPersonaje.nombre, function (res3) {    //comprar personaje
          juego.comprarPersonaje(res3, datosPersonaje.nombre, function (res4) {    //comprar personaje
            expect(res4.res).toBe("personaje ya comprado");  //comprobar resultado
            done();
          })
        })
      });
    });
  });




});



describe("partidas", function () {
  var juego;
  var personaje;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  beforeEach(function () {
    juego = new modelo.Juego();
    personaje = new modelo.Personaje("Default", "assets/images/personajes/Default.png", 0, 3, 50, 1, "El personaje por defecto. No corre mucho ni tampoco aguanta, pero ahí está.");
  });

  it("comprobaciones iniciales", function () {
    expect(Object.keys(juego.usuarios).length).toEqual(0);
    expect(Object.keys(juego.partidas).length).toEqual(0);
  });

  //PARTIDAS
  it("comprobar usuario pepe crea partida una", function () {
    juego.agregarUsuario("pepe", personaje, function () { });
    juego.crearPartida("una", "pepe", function () { });
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(juego.partidas["unapepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].jugadores["pepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].idp).toBe("unapepe");
  });
  it("comprobar usuario ana se une a partida unapepe", function () {
    juego.agregarUsuario("pepe", personaje, function () { });
    juego.crearPartida("una", "pepe", function () { });
    juego.agregarUsuario("ana", personaje, function () { });
    expect(Object.keys(juego.usuarios).length).toEqual(2);
    juego.unirAPartida("unapepe", "ana");
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(Object.keys(juego.partidas["unapepe"].jugadores).length).toEqual(2);
    expect(juego.partidas["unapepe"].jugadores["ana"]).not.toBe(undefined);
  });
  it("comprobar usuario pepe sale de partida unapepe (dos jugadores)", function () {
    juego.agregarUsuario("pepe", personaje, function () { });
    juego.crearPartida("una", "pepe", function () { });
    var partida = juego.partidas["unapepe"];
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(partida).not.toBe(undefined);
    expect(partida.jugadores["pepe"]).not.toBe(undefined);
    expect(partida.idp).toBe("unapepe");
    juego.agregarUsuario("ana", personaje, function () { });
    juego.unirAPartida("unapepe", "ana");
    juego.salir("unapepe", "pepe");
    expect(partida.jugadores["pepe"]).toBe(undefined);
    expect(Object.keys(partida.jugadores).length).toBe(1);
  });
  it("comprobar usuario pepe sale de partida unapepe y se elimina", function () {
    juego.agregarUsuario("pepe", personaje, function () { });
    juego.crearPartida("una", "pepe", function () { });
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(juego.partidas["unapepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].jugadores["pepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].idp).toBe("unapepe");
    juego.salir("unapepe", "pepe");
    expect(juego.partidas["unapepe"]).toBe(undefined);
  });
});
