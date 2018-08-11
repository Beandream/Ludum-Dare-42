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
var doubleJump = false;

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('floor', 'assets/floor.png')
}

function create(){

    cursors = this.input.keyboard.createCursorKeys();
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.image(400, 300, 'background');
    floor = this.physics.add.staticImage(400, 580, 'floor');
    spike1 = this.physics.add.sprite(-500, 300, 'spikeWall');
    spike2 = this.physics.add.sprite(1300, 300, 'spikeWall').setFlipX(true).setFlipY(true);
    slime = this.physics.add.sprite(500, 300, 'greenSlime').setScale(0.4);
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5).setDrag(0);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.overlap(spike2, spike1, End);
    this.physics.add.collider(player, floor);
    this.physics.add.collider(slime, floor);
    this.physics.add.overlap(player, slime, newSlime);

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

function newSlime(){
    slime.setPosition(300, 400);
}

function End(){
    speed = 0;
}

