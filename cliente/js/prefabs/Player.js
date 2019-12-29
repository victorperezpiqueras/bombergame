var Bomberman = Bomberman || {};

Bomberman.Player = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);

    this.anchor.setTo(0.5);
    this.name = name;
    this.estado = "vivo";
    ws.spriteLocal = this;
    //ws.jugador = this;

    //this.walking_speed = +properties.walking_speed;
    this.walking_speed = JSON.parse($.cookie("usr")).personajeSeleccionado.velocidad;
    this.bomb_duration = +properties.bomb_duration;
    //this.vidas = +properties.vidas;
    this.vidas = JSON.parse($.cookie("usr")).personajeSeleccionado.vidas;
    this.dropping_bomb = false;

    this.animations.add("walking_down", [1, 2, 3], 10, true);
    this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_up", [0, 8, 9], 10, true);

    this.stopped_frames = [1, 4, 4, 0, 1];

    this.game_state.game.physics.arcade.enable(this);
    this.body.setSize(14, 12, 0, 4);

    this.x = ws.jugador.posicion.x;
    this.y = ws.jugador.posicion.y;

    this.initial_position = new Phaser.Point(this.x, this.y);
    //this.ant=this.initial_position;

    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();

    //this.number_of_bombs = localStorage.number_of_bombs || +properties.number_of_bombs;
    this.number_of_bombs = JSON.parse($.cookie("usr")).personajeSeleccionado.bombas;
    this.current_bomb_index = 0;
};

Bomberman.Player.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Player.prototype.constructor = Bomberman.Player;

Bomberman.Player.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);

    //this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);

    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.remotos, this.killPlayer, null, this);//
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.kill, null, this);

    if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
        // move left
        ws.mover("left", { x: this.x, y: this.y });
        this.body.velocity.x = -this.walking_speed;
        if (this.body.velocity.y === 0) {
            // change the scale, since we have only one animation for left and right directions
            this.scale.setTo(-1, 1);
            this.animations.play("walking_left");
        }
    } else if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
        // move right
        ws.mover("right", { x: this.x, y: this.y });
        this.body.velocity.x = +this.walking_speed;
        if (this.body.velocity.y === 0) {
            // change the scale, since we have only one animation for left and right directions
            this.scale.setTo(1, 1);
            this.animations.play("walking_right");
        }
    } else {
        ws.mover("velX", { x: this.x, y: this.y });
        this.body.velocity.x = 0;
    }

    if (this.cursors.up.isDown && this.body.velocity.y <= 0) {
        // move up
        ws.mover("up", { x: this.x, y: this.y });
        this.body.velocity.y = -this.walking_speed;
        if (this.body.velocity.x === 0) {
            this.animations.play("walking_up");
        }
    } else if (this.cursors.down.isDown && this.body.velocity.y >= 0) {
        // move down
        ws.mover("down", { x: this.x, y: this.y });
        this.body.velocity.y = +this.walking_speed;
        if (this.body.velocity.x === 0) {
            this.animations.play("walking_down");
        }
    } else {
        ws.mover("velY", { x: this.x, y: this.y });
        this.body.velocity.y = 0;
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        // stop current animation
        ws.mover("stopAnimation", { x: this.x, y: this.y });
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];
    }

    /*   if (!this.dropping_bomb && this.game_state.input.keyboard.isDown(Phaser.Keyboard.B)) {
  
          var audio = new Audio('assets/audio/bomb-before-sound.mp3');
          audio.play();
  
          ws.mover("dropTrue", { x: this.x, y: this.y });
          this.drop_bomb();
          this.dropping_bomb = true;
      }
  
      if (this.dropping_bomb && !this.game_state.input.keyboard.isDown(Phaser.Keyboard.B)) {
          ws.mover("dropFalse", { x: this.x, y: this.y });
          this.dropping_bomb = false;
      } */

    var colliding_bombs;
    // if the spacebar is pressed and it is possible to drop another bomb, try dropping it
    if (this.game_state.input.keyboard.isDown(Phaser.Keyboard.B) && this.current_bomb_index < this.number_of_bombs) {
        colliding_bombs = this.game_state.game.physics.arcade.getObjectsAtLocation(this.x, this.y, this.game_state.groups.bombs);
        // drop the bomb only if it does not collide with another one
        if (colliding_bombs.length === 0) {
            var audio = new Audio('assets/audio/bomb-before-sound.mp3');
            audio.play();
            this.drop_bomb();
        }
    }
};

// Bomberman.Player.prototype.bomba=function(){
//     if (this.estado=="vivo"){
//         this.estado="herido";
//         console.log("impacto de bomba");
//         this.x=this.initial_position.x;
//         this.y=this.initial_position.y;
//         ws.jugadorHerido();
//     }
// }

Bomberman.Player.prototype.kill = function () {
    var audio = new Audio('assets/audio/death-sound.mp3');
    audio.play();
    if (this.estado == "vivo") {
        this.estado = "herido";
        this.x = this.initial_position.x;
        this.y = this.initial_position.y;
        ws.jugadorHerido();
    }

}
Bomberman.Player.prototype.killPlayer = function () {
    if (this.estado == "vivo") {
        this.estado = "herido";
        this.x = this.initial_position.x;
        this.y = this.initial_position.y;
        //ws.jugadorHerido();
        ws.mover("inicio", { x: this.x, y: this.y });
    }
}

Bomberman.Player.prototype.volverAInicio = function () {
    this.estado = "vivo";
}

Bomberman.Player.prototype.drop_bomb = function () {
    "use strict";
    var bomb, bomb_name, bomb_position, bomb_properties;
    // get the first dead bomb from the pool
    bomb_name = this.name + "_bomb_" + this.game_state.groups.bombs.countLiving();
    bomb_position = new Phaser.Point(this.x, this.y);
    bomb_properties = { "texture": "bomb_spritesheet", "group": "bombs", bomb_radius: 3 };
    bomb = Bomberman.create_prefab_from_pool(this.game_state.groups.bombs, Bomberman.Bomb.prototype.constructor, this.game_state, bomb_name, bomb_position, bomb_properties);

    this.current_bomb_index += 1;/////////
};