import Phaser from "phaser";

export default class ScoresScreen extends Phaser.Scene {
    constructor() {
        super('scoresscreen')
    }
    preload() {
        this.load.image('highscores_bg', '/assets/background.png')
        this.load.image('back_btn', '/assets/back.png')
        this.load.image('highscores_header', '/assets/highscores.png')
    }

    create() {
        this.add.image(400, 300, 'highscores_bg')
        let backBtn = this.add.image(150, 125, 'back_btn')
        backBtn.setInteractive()
        backBtn.on("pointerdown", ()=>{
            this.scene.start('startscreen')
        })
        this.add.image(400, 155, 'highscores_header')
    }
}