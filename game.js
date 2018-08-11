var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
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
var speed = 3;

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('spikeWall', 'assets/spikeWall.png');
    this.load.image('greenSlime', 'assets/greenSlime.png');
}

function create(){
    this.add.image(400, 300, 'background');
    this.add.image(350, 300, 'greenSlime').setScale(0.2);
    this.add.image(400, 300, 'greenSlime').setScale(0.3);
    this.add.image(450, 300, 'greenSlime').setScale(0.4);
    spike1 = this.physics.add.sprite(-500, 300, 'spikeWall');
    spike2 = this.physics.add.sprite(1300, 300, 'spikeWall').setFlipX(true).setFlipY(true);

    this.physics.add.overlap(spike2, spike1, End);
}
function update(){
    // spike1.x += speed;
    // spike2.x += -speed;
}

function End(){
    speed = 0;
}