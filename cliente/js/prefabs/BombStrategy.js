BombStrategy = function (orientacion) {
    this.orientacion = orientacion;

    this.addAnimation = function (bomb) {
        return bomb.animations.add("exploding", [0, 2, 4], 1, false);
    };
    this.playSound = function () {
        var audio = new Audio('assets/audio/bomb-before-sound.mp3');
        audio.play();
    }
    this.explode = function (bomb) {
        "use strict";
        var audio = new Audio('assets/audio/bomb-sound.mp3');
        audio.play();
        bomb.kill();
        var explosion_name, explosion_position, explosion_properties, explosion, wall_tile, block_tile;
        explosion_name = bomb.name + "_explosion_" + bomb.game_state.groups.explosions.countLiving();
        explosion_position = new Phaser.Point(bomb.position.x, bomb.position.y);
        explosion_properties = { texture: "explosion_image", group: "explosions", duration: 0.5 };
        // create an explosion in the bomb position
        explosion = Bomberman.create_prefab_from_pool(bomb.game_state.groups.explosions, Bomberman.Explosion.prototype.constructor, bomb.game_state,
            explosion_name, explosion_position, explosion_properties);

        // create explosions in each direction
        bomb.create_explosions(-1, -bomb.bomb_radius, -1, "x");
        bomb.create_explosions(1, bomb.bomb_radius, +1, "x");
        bomb.create_explosions(-1, -bomb.bomb_radius, -1, "y");
        bomb.create_explosions(1, bomb.bomb_radius, +1, "y");

        bomb.game_state.prefabs.player.current_bomb_index -= 1;
    };

    this.create_explosions = function (initial_index, final_index, step, axis, bomb) {
        "use strict";
        var index, explosion_name, explosion_position, explosion, explosion_properties, wall_tile, block_tile;
        explosion_properties = { texture: "explosion_image", group: "explosions", duration: 0.5 };
        for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) {
            explosion_name = bomb.name + "_explosion_" + bomb.game_state.groups.explosions.countLiving();
            // the position is different accoring to the axis
            if (axis === "x") {
                explosion_position = new Phaser.Point(bomb.position.x + (index * bomb.width), bomb.position.y);
            } else {
                explosion_position = new Phaser.Point(bomb.position.x, bomb.position.y + (index * bomb.height));
            }
            wall_tile = bomb.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, bomb.game_state.map.tileWidth, bomb.game_state.map.tileHeight, "walls");
            block_tile = bomb.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, bomb.game_state.map.tileWidth, bomb.game_state.map.tileHeight, "blocks");
            if (!wall_tile && !block_tile) {
                // create a new explosion in the new position
                explosion = Bomberman.create_prefab_from_pool(bomb.game_state.groups.explosions, Bomberman.Explosion.prototype.constructor, bomb.game_state, explosion_name, explosion_position, explosion_properties);
            } else {
                if (block_tile) {
                    // check for item to spawn
                    bomb.check_for_item({ x: block_tile.x * block_tile.width, y: block_tile.y * block_tile.height },
                        { x: block_tile.width, y: block_tile.height });
                    bomb.game_state.map.removeTile(block_tile.x, block_tile.y, "blocks");
                }
                break;
            }
        }
    };

};
