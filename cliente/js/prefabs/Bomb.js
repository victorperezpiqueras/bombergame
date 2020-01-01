var Bomberman = Bomberman || {};

Bomberman.Bomb = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    this.tipoBomba = properties.tipoBomba;
    this.orientacion = this.game_state.prefabs.player.obtenerOrientacion();
    //console.log("new bomb", this.orientacion)
    switch (this.tipoBomba) {
        case ("Mago"):
            this.estrategia = new MagoStrategy(this.orientacion); break;
        case ("Bomba"):
            this.estrategia = new BombStrategy(this.orientacion); break;
        default:
            this.estrategia = new BombStrategy(this.orientacion); break;
    }
    //console.log(this.estrategia)
    this.anchor.setTo(0.5);

    this.bomb_radius = +properties.bomb_radius;

    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;

    //this.exploding_animation = this.animations.add("exploding", [0, 2, 4], 0.5, false);
    this.exploding_animation = this.estrategia.addAnimation(this);
    this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
    this.estrategia.playSound();
    
};

Bomberman.Bomb.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Bomb.prototype.constructor = Bomberman.Bomb;

Bomberman.Bomb.prototype.reset = function (position_x, position_y) {
    this.orientacion = this.game_state.prefabs.player.obtenerOrientacion();//////////
    //console.log(this.tipoBomba)
    switch (this.tipoBomba) {
        case ("Mago"):
            this.estrategia = new MagoStrategy(this.orientacion); break;
        case ("Bomba"):
            this.estrategia = new BombStrategy(this.orientacion); break;
        default:
            this.estrategia = new BombStrategy(this.orientacion); break;
    }
    //console.log("reset bomb", this.orientacion)
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    this.exploding_animation.restart();
};

Bomberman.Bomb.prototype.explode = function () {
    this.estrategia.explode(this);
};

Bomberman.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis) {
    this.estrategia.create_explosions(initial_index, final_index, step, axis, this)
};

Bomberman.Bomb.prototype.check_for_item = function (block_position, block_size) {
    "use strict";
    var random_number, item_prefab_name, item, item_probability, item_name, item_position, item_properties, item_constructor, item_prefab;
    random_number = this.game_state.game.rnd.frac();
    // search for the first item that can be spawned
    for (item_prefab_name in this.game_state.items) {
        if (this.game_state.items.hasOwnProperty(item_prefab_name)) {
            item = this.game_state.items[item_prefab_name];
            item_probability = item.probability;
            // spawns an item if the random number is less than the item probability
            if (random_number < item_probability) {
                item_name = this.name + "_items_" + this.game_state.groups[item.properties.group].countLiving();
                item_position = new Phaser.Point(block_position.x + (block_size.x / 2), block_position.y + (block_size.y / 2));
                console.log(item_position);
                item_properties = item.properties;
                item_constructor = this.game_state.prefab_classes[item_prefab_name];
                item_prefab = Bomberman.create_prefab_from_pool(this.game_state.groups.items, item_constructor, this.game_state, item_name, item_position, item_properties);
                break;
            }
        }
    }
};