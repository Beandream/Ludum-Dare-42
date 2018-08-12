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

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('floor', 'assets/floor.png')
}

function create(){

    for(var i = 0; i < 100; i++) {
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

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.overlap(spike2, spike1, End);
    this.physics.add.collider(player, floor);
    
    slimes.forEach((slime) => {
        slime.sprite = this.physics.add.sprite(slime.xPos, slime.yPos, slime.texture).setScale(0.4).setBounce(0.8).setVelocityX(200);
        slime.sprite.body.collideWorldBounds = true;
        this.physics.add.collider(slime.sprite, floor);
        this.physics.add.overlap(player, slime.sprite, slime.slimeJump);
        slime.setPosition;
    })


}
function update(){
    plyrControl();
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

