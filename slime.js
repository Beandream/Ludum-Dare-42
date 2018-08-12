export default class Slime {
    constructor(xPos, yPos, texture) {
        console.log("constructing slime")
        this.xPos = xPos;
        this.yPos = yPos;
        this.texture = texture;
        this.sprite;
    }

    setPosition(player, slime){
       slime.setPosition(getRandomInt(100, 400), getRandomInt(100, 400));
       slime.setVelocityX(getRandomInt(-200, 200));
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}