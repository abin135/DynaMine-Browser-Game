import Phaser from 'phaser'

export default class StartScreen extends Phaser.Scene {
    constructor() {
        super('startscreen')
    }

    preload() {
        this.load.image('start_bg', '/assets/background.png')
        this.load.image("title_img", "/assets/title.png")
        this.load.image("start_img", "/assets/start.png")
        this.load.image("highscores_img", "/assets/highscores.png")
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
        let scoresBtn = this.add.image(400, 400, 'highscores_img')
        scoresBtn.setInteractive()
        scoresBtn.on("pointerdown", ()=>{
            this.scene.start('scoresscreen')
            
            return this.scene.stop('inputscreen')
        });

    }
}