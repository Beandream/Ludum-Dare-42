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
var keyShift;
var doubleJump = false;
var jumped = false;
var slimes = [];
var sword;
var thrown = false;
var attackframe = 10;
var attack = false;
var angle;
var gold = 0;
var goldText;
var rocket;
var floors;
var slimesSpawned = false;
var infoText;
var losed = false;

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('floor', 'assets/floor.png');
    this.load.image('sword', 'assets/sword.png');
    this.load.image('rocket', 'assets/rocket.png');
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
    keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.add.image(400, 300, 'background');

    floors = this.physics.add.staticGroup();
    floors.create(400, 580, 'floor');
    floors.create(100, 300, 'floor').setScale(0.3).refreshBody();
    floors.create(700, 300, 'floor').setScale(0.3).refreshBody();
    floors.create(400, 100, 'floor').setScale(0.3).refreshBody();

    rocket = this.physics.add.sprite(400, 505, 'rocket');
    rocket.body.allowGravity = false;
    spike1 = this.physics.add.sprite(-400, 300, 'spikeWall');
    spike2 = this.physics.add.sprite(1200, 300, 'spikeWall').setFlipX(true).setFlipY(true);
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5).setDrag(0);
    sword = this.physics.add.sprite(player.x, player.y, 'sword').setCollideWorldBounds(true).setScale(1);
    sword.body.allowGravity = false;
    spike1.body.allowGravity = false;
    spike2.body.allowGravity = false;
    spike1.body.immovable = true;
    spike2.body.immovable = true;
    console.log(spike1.body);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.overlap(spike2, spike1, End);
    this.physics.add.collider(player, floors);
    
    slimes.forEach((slime) => {
        slime.sprite = this.physics.add.sprite(slime.xPos, slime.yPos, slime.texture).setScale(0.4).setBounce(1, 0.3).setVelocityX(200);
        slime.sprite.body.world.bounds.top = -100;
        console.log(slime.sprite.body.world.bounds.height)
        slime.sprite.body.collideWorldBounds = true;
        this.physics.add.collider(slime.sprite, floors);
        this.physics.add.collider(slime.sprite, spike1);
        this.physics.add.collider(slime.sprite, spike2);
        this.physics.add.overlap(player, slime.sprite, slime.setPosition);
        this.physics.add.overlap(player, slime.sprite, hurt);
        this.physics.add.overlap(sword, slime.sprite, slime.setPosition);
        this.physics.add.overlap(sword, slime.sprite, killSlime);
        this.physics.add.overlap(sword, slime.sprite, function(){if (thrown){thrown = false;swordRest();}});
        slimesSpawned = true;
    })

    this.input.on('pointerdown', function (pointer) {
        if (!thrown){
            if (keyShift.isDown){
                thrown = true;
                let mouse = pointer;
                let angle = Phaser.Math.Angle.Between(player.x, player.y, mouse.x, mouse.y)          
                throwSword(mouse, angle);
            }
            else{
                attackframe = 0;
                thrown = true;
                attack = true;
            }
        }
    }, this);
    
    this.input.on('pointermove', function (pointer) {
        let mouse = pointer
        angle = Phaser.Math.Angle.Between(player.x, player.y, mouse.x, mouse.y)            
        getAngle(angle);
    }, this);
    
    this.physics.add.overlap(sword, floors, function(){if (thrown){thrown = false;swordRest();}});
    this.physics.add.overlap(player, rocket, () => {
        if (gold > 9){
            this.cameras.main.fade(4000, 255, 255, 255);
            goldText.setText("");
            infoText.setColor("#000")
            infoText.setText("         YOU WIN!");
            player.y = 700;
            rocket.setAccelerationY(-100);
        }
    });
    goldText = this.add.text(16, 16, 'Gold: 0', { fontSize: '32px', fill: '#ffffff' });
    infoText = this.add.text(150, 350, 'WASD, Hold Shift to throw\n  Sword with left Click', { fontSize: '32px', fill: '#000' });
    // console.log(this.physics.on(''));
    this.physics.add.overlap(player, spike1, () => {
        // resetAll();
        this.cameras.main.fade(1500, 0, 0, 0);
    });
    this.physics.add.overlap(player, spike2, () => {
        // resetAll();
        this.cameras.main.fade(1500, 0, 0, 0);
    });
    // this.input.on('pointermove', function () {
    //     resetAll();
    //     this.cameras.main.fade(1500, 0, 0, 0);
    // }, this);
    this.cameras.main.on('camerafadeoutcomplete', function () {
        resetAll();
        this.scene.restart();

    }, this);

}

function update(){

    spike1.setVelocityX(10);
    spike2.setVelocityX(-10);
    if (slimesSpawned){
        slimeControls();
    }
    plyrControl();
    swordRest();

    if (attack){
        if (attackframe < 10){
            if (angle > 1 && angle < 2){
                sword.y = player.y + 30;
            }
            else if (angle < -1 && angle > -2){
                sword.y = player.y - 30;
            }
            if (Math.abs(angle) > 2){
                sword.x = player.x - 30;
            }
            else if (Math.abs(angle) < 1){
                sword.x = player.x + 30;
            }
            sword.setVelocity(0, 0).setScale(1.5);
            // sword.x = player.x;
            // sword.y = player.y;
            attackframe += 1;
        }
        else{
            attack = false;
            thrown = false;
        }
    }
}

function resetAll(){
    speed = 0;
    doubleJump = false;
    jumped = false;
    thrown = false;
    attackframe = 10;
    attack = false;
    gold = 0;
    slimesSpawned = false;
    losed = false;
    slimes = [];
}

function slimeControls(){
    if (gold > 5){
        slimes.forEach((slime) => {
            slime.slimeJump(player, slime);
        })
    }
}

function hurt(){
    if (gold > 0){
        gold = gold - 1;
        goldText.setText('Gold: ' + gold);
    }
}

function killSlime(){
    gold = gold + 1;
    goldText.setText('Gold: ' + gold);
}

function swordRest(){
    if (!thrown){
        sword.body.checkCollision.none = true;
        sword.allowGravity = false;
        sword.setVelocity(0, 0);
        sword.setOrigin(0.5, 0.5);
        sword.setScale(1);
        sword.x = player.x;
        sword.y = player.y;
    }
    else{
        sword.body.checkCollision.none = false;
    }
}

function getAngle (angle, mouse){
    sword.rotation = angle;
}

function throwSword(mouse, angle){
    infoText.setText("");
    sword.body.allowGravity = true;
    sword.setScale(1.3);
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
    spike1.setVelocityX(0);
    spike2.setVelocityX(0);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

