import Slime from "./slime.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 2500},
            // debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var spike1;
var spike2;
var player;
var floor;
var speed = 0;
var cursors;
var keyW;
var keyA;
var keyD;
var keySpace;
var doubleJump = false;
var jumped = false;
var slimes = [];
var sword;
var thrown = false;

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('floor', 'assets/floor.png')
    this.load.image('sword', 'assets/sword.png')
}

function create(){

    for(var i = 0; i < 3; i++) {
        var xPos = getRandomInt(100, 700);
        var yPos = getRandomInt(100, 400);
        slimes.push(new Slime(xPos, yPos, 'greenSlime'))
    }

    cursors = this.input.keyboard.createCursorKeys();
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.image(400, 300, 'background');
    floor = this.physics.add.staticImage(400, 580, 'floor');
    spike1 = this.physics.add.sprite(-500, 300, 'spikeWall');
    spike2 = this.physics.add.sprite(1300, 300, 'spikeWall').setFlipX(true).setFlipY(true);
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5).setDrag(0);
    sword = this.physics.add.sprite(player.x, player.y, 'sword').setCollideWorldBounds(true);
    sword.body.allowGravity = false;

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.overlap(spike2, spike1, End);
    this.physics.add.collider(player, floor);
    
    slimes.forEach((slime) => {
        slime.sprite = this.physics.add.sprite(slime.xPos, slime.yPos, slime.texture).setScale(0.4).setBounce(0.8).setVelocityX(200);
        slime.sprite.body.collideWorldBounds = true;
        this.physics.add.collider(slime.sprite, floor);
        this.physics.add.overlap(player, slime.sprite, slime.slimeJump);
        this.physics.add.overlap(sword, slime.sprite, slime.slimeJump);
        this.physics.add.overlap(sword, slime.sprite, resetSword);
    })


    this.input.on('pointerdown', function (pointer) {
        if (!thrown){
            thrown = true;
            let mouse = pointer;
            let angle = Phaser.Math.Angle.Between(player.x, player.y, mouse.x, mouse.y)          
            throwSword(mouse, angle);
        }
    }, this);
    
    this.input.on('pointermove', function (pointer) {
        let mouse = pointer
        let angle = Phaser.Math.Angle.Between(player.x, player.y, mouse.x, mouse.y)            
        getAngle(angle);
    }, this);
    
    this.physics.add.overlap(sword, floor, resetSword);


}

function update(){
    plyrControl();

    if (!thrown){
        sword.x = player.x;
        sword.y = player.y;
    }

}

function resetSword(){
    sword.allowGravity = false;
    sword.setVelocity(0, 0);
    sword.x = player.x;
    sword.y = player.y;
    thrown = false;
}

function getAngle (angle, mouse){
    sword.rotation = angle;
}

function throwSword(mouse, angle){
    sword.body.allowGravity = true;
    if (Math.abs(angle) >= 1.5){
        sword.setVelocityX(-Phaser.Math.Distance.Between(player.x, 0, mouse.x, 0)*4)
    }
    else {
        sword.setVelocityX(Phaser.Math.Distance.Between(player.x, 0, mouse.x, 0)*4)
    }
    if (angle < 0){
        sword.setVelocityY(-Phaser.Math.Distance.Between(0, player.y, 0, mouse.y)*7)
    }
    else {
        sword.setVelocityY(Phaser.Math.Distance.Between(0, player.y, 0, mouse.y)*7)
    }
    // sword.x = mouse.position.x;
    // sword.y = mouse.position.y;
    // thrown = false;
}

function plyrControl(){

    if (keyA.isDown){
        speed = 400;
        player.setVelocityX(-speed);
        player.setFlipX(true);
    }
    else if (keyD.isDown){
        speed = 400
        player.setVelocityX(speed);
        player.setFlipX(false);
    }
    else{
        if (speed > 0){
            speed -= 20;
        }
        if (player.flipX == true){
            player.setVelocityX(-speed);
        }
        else{
            player.setVelocityX(speed);
        }
    }

    if (keyW.isDown){
        if (player.body.touching.down){
            player.setVelocityY(-990);
            jumped = true;
        }
        else if (doubleJump == true) {
            player.setVelocityY(-990);
            doubleJump = false;
        }
    }
    else if (!keyW.isDown && !player.body.touching.down && jumped == true){
        doubleJump = true;
        jumped = false
    }
}


function End(){
    speed = 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

