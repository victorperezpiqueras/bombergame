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
  xit("insertar resultado", function (done) {
    //const resultado = { nickGanador: "ganador", nombre: "partida", nivel: "1", jugadores: ["ganador"] };
    const partida = juego.Partida("partida", "1");
    partida.nickGanador = "ganador";
    partida.jugadores = ["ganador"];
    juego.anotarResultado(resultado, function () { //anotar resultado
      juego.obtenerResultados(function (res) {    //obtenerlo y comprobarlo
        expect(res[0].nickGanador).toEqual(resultado.nickGanador);
        expect(res[0].nombre).toEqual(resultado.nombre);
        expect(res[0].nivel).toEqual(resultado.nivel);
        expect(res[0].jugadores).toEqual(resultado.jugadores);
        expect(res.length).toBe(1);   //hay un resultado insertado
        juego.eliminarResultado(res[0]._id, function (res) {//eliminarlo
          expect(res.resultados).toEqual(1);    //ok
          juego.obtenerResultados(function (res) {
            expect(res.length).toBe(0);     //se ha borrado
            done();
          })
        })
      })
    })
  });

  //PERSONAJES:
  it("generar y comprobar personajes", function (done) {
    console.log('------generar y comprobar personajes------');
    // juego.eliminarPersonajes(function (res) {
    //juego.generarPersonajes(function (res) {
    juego.obtenerPersonajes(function (pers) {
      expect(pers.length).toBe(5);
    })
    // })
    //})
  });
});



describe("partidas", function () {
  var juego;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  beforeEach(function () {
    juego = new modelo.Juego();
  });

  it("comprobaciones iniciales", function () {
    expect(Object.keys(juego.usuarios).length).toEqual(0);
    expect(Object.keys(juego.partidas).length).toEqual(0);
  });

  //PARTIDAS
  it("comprobar usuario pepe crea partida una", function () {
    juego.agregarUsuario("pepe", function () { });
    juego.crearPartida("una", "pepe", function () { });
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(juego.partidas["unapepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].jugadores["pepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].idp).toBe("unapepe");
  });
  it("comprobar usuario ana se une a partida unapepe", function () {
    juego.agregarUsuario("pepe", function () { });
    juego.crearPartida("una", "pepe", function () { });
    juego.agregarUsuario("ana", function () { });
    expect(Object.keys(juego.usuarios).length).toEqual(2);
    juego.unirAPartida("unapepe", "ana");
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(Object.keys(juego.partidas["unapepe"].jugadores).length).toEqual(2);
    expect(juego.partidas["unapepe"].jugadores["ana"]).not.toBe(undefined);
  });
  it("comprobar usuario pepe sale de partida unapepe (dos jugadores)", function () {
    juego.agregarUsuario("pepe", function () { });
    juego.crearPartida("una", "pepe", function () { });
    var partida = juego.partidas["unapepe"];
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(partida).not.toBe(undefined);
    expect(partida.jugadores["pepe"]).not.toBe(undefined);
    expect(partida.idp).toBe("unapepe");
    juego.agregarUsuario("ana", function () { });
    juego.unirAPartida("unapepe", "ana");
    juego.salir("unapepe", "pepe");
    expect(partida.jugadores["pepe"]).toBe(undefined);
    expect(Object.keys(partida.jugadores).length).toBe(1);
  });
  it("comprobar usuario pepe sale de partida unapepe y se elimina", function () {
    juego.agregarUsuario("pepe", function () { });
    juego.crearPartida("una", "pepe", function () { });
    expect(Object.keys(juego.partidas).length).toEqual(1);
    expect(juego.partidas["unapepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].jugadores["pepe"]).not.toBe(undefined);
    expect(juego.partidas["unapepe"].idp).toBe("unapepe");
    juego.salir("unapepe", "pepe");
    expect(juego.partidas["unapepe"]).toBe(undefined);
  });






});
