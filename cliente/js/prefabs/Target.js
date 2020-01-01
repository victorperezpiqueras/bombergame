var Bomberman = Bomberman || {};

Bomberman.Target = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

Bomberman.Target.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Target.prototype.constructor = Bomberman.Target;

Bomberman.Target.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
};

Bomberman.Target.prototype.kill = function () {
    "use strict";
    var goal_position, goal_properties, goal;
    Phaser.Sprite.prototype.kill.call(this);
    if (this.game_state.groups.targets.countLiving() === 0) {
        // create goal
        goal_position = new Phaser.Point(this.game_state.game.world.width / 2, this.game_state.game.world.height / 2);
        goal_properties = {texture: "goal_image", group: "goals"};
        goal = new Bomberman.Goal(this.game_state, "goal", goal_position, goal_properties);
    }
};