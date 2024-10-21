import Phaser from 'phaser';
import GameScreen from './GameScreen';

export default class StartScreen extends Phaser.Scene {
    constructor() {
        super('startscreen');
    }

    preload() {
        this.load.image('start_bg', '/assets/startBg.png')
        this.load.image("title_img", "/assets/title.png");
        this.load.image("start_img", "/assets/start.png");
        this.load.image("highscores_img", "/assets/highscores.png");
    }

    //create start screen
    create() {
        this.add.image(400, 300, 'start_bg');
        this.add.image(400, 220, 'title_img');
        let startBtn = this.add.image(200, 400, 'start_img');
        startBtn.setInteractive();
        startBtn.on("pointerdown", ()=>{
            this.scene.launch(GameScreen);
        })
        this.add.image(600, 400, 'highscores_img');
    }
}