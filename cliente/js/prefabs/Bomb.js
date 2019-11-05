var Bomberman = Bomberman || {};

Bomberman.Bomb = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.bomb_radius = +properties.bomb_radius;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    
    this.exploding_animation = this.animations.add("exploding", [0, 2, 4], 1, false);
    this.exploding_animation.onComplete.add(this.kill, this);
    this.animations.play("exploding");
};

Bomberman.Bomb.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Bomb.prototype.constructor = Bomberman.Bomb;

Bomberman.Bomb.prototype.reset = function (position_x, position_y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    this.exploding_animation.restart();
};

Bomberman.Bomb.prototype.kill = function () {
    "use strict";
    Phaser.Sprite.prototype.kill.call(this);
    var explosion_name, explosion_position, explosion_properties, explosion;
    explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
    explosion_position = new Phaser.Point(this.position.x, this.position.y);
    explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5};
    // create an explosion in the bomb position
    explosion = Bomberman.create_prefab_from_pool(this.game_state.groups.explosions, Bomberman.Explosion.prototype.constructor, this.game_state,
                                                      explosion_name, explosion_position, explosion_properties);
    
    // create explosions in each direction
    this.create_explosions(-1, -this.bomb_radius, -1, "x");
    this.create_explosions(1, this.bomb_radius, +1, "x");
    this.create_explosions(-1, -this.bomb_radius, -1, "y");
    this.create_explosions(1, this.bomb_radius, +1, "y");
};

Bomberman.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis) {
    "use strict";
    var index, explosion_name, explosion_position, explosion, explosion_properties, tile;
    explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5};
    for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) {
        explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
        // the position is different accoring to the axis
        if (axis === "x") {
            explosion_position = new Phaser.Point(this.position.x + (index * this.width), this.position.y);
        } else {
            explosion_position = new Phaser.Point(this.position.x, this.position.y + (index * this.height));
        }
        tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "collision");
        if (!tile) {
            // create a new explosion in the new position
            explosion = Bomberman.create_prefab_from_pool(this.game_state.groups.explosions, Bomberman.Explosion.prototype.constructor, this.game_state, explosion_name, explosion_position, explosion_properties);
        } else {
            break;
        }
    }
};