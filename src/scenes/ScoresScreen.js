import Phaser from "phaser";

export default class ScoresScreen extends Phaser.Scene {
    constructor() {
        super('scoresscreen')

        this.playerText = undefined
        this.firstScore = undefined
        this.firstRank = undefined
    }

    preload() {
        this.load.image('highscores_bg', '/assets/background.png')
        this.load.image('back_btn', '/assets/back.png')

        this.load.image('block', '/assets/block.png')
        this.load.image('rub', '/assets/rub.png')
        this.load.image('end', '/assets/end.png')

        this.load.bitmapFont('arcade', '/assets/arcade.png', '/assets/arcade.xml')
    }

    create() {
        this.add.image(400, 300, 'highscores_bg')
        
        let backBtn = this.add.image(150, 50, 'back_btn')
        backBtn.setInteractive()
        backBtn.on("pointerdown", ()=>{
            this.scene.start('startscreen')
            return this.scene.stop('inputscreen')
        })

        this.firstScore = JSON.parse(localStorage.getItem('highscore'))
        this.firstRank = this.add.bitmapText(290, 310, 'arcade', this.firstScore).setTint(0xff0000)

        this.add.bitmapText(100, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.add.bitmapText(100, 310, 'arcade', '1ST').setTint(0xff0000);

        this.playerText = this.add.bitmapText(580, 310, 'arcade', '').setTint(0xff0000);

        //  otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false

        this.scene.launch('inputscreen')

        let panel = this.scene.get('inputscreen')

        //  Listen to events from the Input scene
        panel.events.on('updateName', this.updateName, this)
        panel.events.on('submitName', this.submitName, this)
    }

    submitName ()
    {
        this.scene.stop('inputscreen')

        this.add.bitmapText(100, 360, 'arcade', '2ND   40000    ANT').setTint(0xff8200)
        this.add.bitmapText(100, 410, 'arcade', '3RD   30000    .-.').setTint(0xffff00)
        this.add.bitmapText(100, 460, 'arcade', '4TH   20000    BOB').setTint(0x00ff00)
        this.add.bitmapText(100, 510, 'arcade', '5TH   10000    ZIK').setTint(0x00bfff)
    }

    updateName (name)
    {
        this.playerText.setText(name)
    }
}