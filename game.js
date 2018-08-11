import Slime from "./slime.js";
var testGravity = 300;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: testGravity},
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
<<<<<<< HEAD
var doubleJump = false;
=======
var slimes = [];
>>>>>>> ffa96c29bf8afb89b91152d976b42ffd820a61b2

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('floor', 'assets/floor.png')
}

function create(){

    for(var i = 0; i < 3; i++) {
        var xPos = 500 + 10 
        var yPos = 300
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
        slime.sprite = this.physics.add.sprite(slime.xPos, slime.yPos, slime.texture).setScale(0.4);
        this.physics.add.collider(slime.sprite, floor);
        this.physics.add.overlap(player, slime.sprite, slime.setPosition);
    })

}
function update(){
    plyrControl();
}

function plyrControl(){
    if (keyA.isDown){
        speed = 260;
        player.setVelocityX(-speed);
        player.setFlipX(true);
    }
    else if (keyD.isDown){
        speed = 260
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
    if (keyW.isDown && player.body.touching.down && doubleJump == false ){
        player.setVelocityY(-330);
        console.log('jump 1') 
        doubleJump == true;     
    }
    else if (keyW.isDown && doubleJump == true && player.body.velocity.y == 0){
        player.setVelocityY(-330);
        console.log('jump 2') 
        // doubleJump = false;
    }
}


function End(){
    speed = 0;
}

