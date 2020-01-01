var Bomberman = Bomberman || {};

Bomberman.LifeItem = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Item.call(this, game_state, name, position, properties);
};

Bomberman.LifeItem.prototype = Object.create(Bomberman.Item.prototype);
Bomberman.LifeItem.prototype.constructor = Bomberman.LifeItem;

Bomberman.LifeItem.prototype.collect_item = function (item, player) {
    "use strict";
    Bomberman.Item.prototype.collect_item.call(this);
    if (player.vidas + 1 < JSON.parse($.cookie("usr")).personajeSeleccionado.vidas) {
        player.vidas += 1;
        ws.jugadorCurado();
    }
};