import Phaser from 'phaser'

export default class StartScreen extends Phaser.Scene {
    constructor() {
        super('startscreen')
    }

    preload() {
        this.load.image('start_bg', '/assets/background.png')
        this.load.image("title_img", "/assets/title.png")
        this.load.image("start_img", "/assets/start.png")
        this.load.image("howToPlay_img", "/assets/howtoplay.png")

        this.load.bitmapFont('arcade', '/assets/arcade.png', '/assets/arcade.xml')
    }

    //create start screen
    create() {
        this.add.image(400, 300, 'start_bg')
        this.add.image(400, 180, 'title_img')
        
        //start picture starts the gamescreen
        let startBtn = this.add.image(400, 300, 'start_img')
        startBtn.setInteractive()
        startBtn.on("pointerdown", ()=>{
            this.scene.start('gamescreen')
        });
        
        //highscore picture starts the scoresscreen
        let scoresBtn = this.add.image(400, 400, 'howToPlay_img')
        scoresBtn.setInteractive()
        scoresBtn.on("pointerdown", ()=>{
            let screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
            this.add.bitmapText(screenCenterX, 470, 'arcade', `Move with WASD. Avoid TNT. \n\nCollect diamonds and mine rocks.`).setTint(0xffffff).setScale(0.5).setOrigin(0.5)
        });

    }
}