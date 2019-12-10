var modelo = require("../modelo.js");
var cifrado = require("../cifrado.js");

describe("Bombergame", function () {
  var juego;

  beforeEach(function () {
    juego = new modelo.Juego();
  });

  /* CUENTAS DE USUARIO */
  it("registrar usuario", function () {
    const user = { email: "test@test", nick: "test", password: "test" };
    juego.registrarUsuario(user, function (res) {
      expect(res.nick).toEqual("test");
      expect(res.email).toEqual("test@test");
      expect(res.password).toEqual(cifrado.encrypt("test"));

      juego.loginUsuario(user, function (res) {
        juego.eliminarUsuario(user._id, function (res2) {
          //expect(res2.resultados).toEqual(1);
          done();
        })
      });
    });

  });

  it("loguear usuario", function () {
    juego.registrarUsuario({ email: "test@test", nick: "test", password: "test" }, function (res) {
      const user = { nick: "test", password: "test" };
      juego.loginUsuario(user, function (res) {
        expect(res.nick).toEqual("test");
        juego.eliminarUsuario(user._id, function (res) { });
        done();
      });
    });
  });

  it("eliminar usuario", function () {
    const user = { email: "test@test", nick: "test", password: "test" };
    juego.registrarUsuario(user, function (res) {
      juego.loginUsuario(user, function (res) {
        juego.eliminarUsuario(user._id, function (res) {
          expect(res.resultados).toEqual(1);
          done();
        })
      });
    });
  });

  it("actualizar usuario", function () {
    const user = { email: "test@test", nick: "test", password: "test" };
    const newPassword = "newPassword";
    juego.registrarUsuario(user, function (res) {
      juego.loginUsuario(user, function (res) {
        juego.actualizarUsuario({ uid: res._id, oldpass: res.password, newpass: newPassword }, function (res) {
          expect(res.password).toEqual(newPassword);
          done();
        })
      });
    });
  });

  it("comprobaciones iniciales", function () {
    expect(Object.keys(juego.usuarios).length).toEqual(0);
    expect(Object.keys(juego.partidas).length).toEqual(0);
  });

  /*   it("comprobar agregar usuario", function () {
      juego.agregarUsuario('pepe', function (usr) {
        expect(Object.keys(juego.usuarios).length).toEqual(1);
        expect(juego.usuarios["pepe"]).not.toBe(undefined);
        expect(juego.usuarios["pepe"].nick).toBe("pepe");
      });
    }); */

  /* PARTIDAS */
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

  it("eliminar usuario", function () {
    const user = { email: "test@test", nick: "test", password: "test" };
    juego.registrarUsuario(user, function (res) {
      juego.loginUsuario(user, function (res) {
        juego.eliminarUsuario(user._id, function (res2) {
          expect(res2.resultados).toEqual(1);
        })
      });
    });
  });








});
