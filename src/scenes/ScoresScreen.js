import Phaser from "phaser";

export default class ScoresScreen extends Phaser.Scene {
    constructor() {
        super('scoresscreen')

        this.playerText = undefined
        this.currentScore = undefined
        this.nameHighscore = undefined
        this.getName = undefined
        this.highscoreList = undefined
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

        this.currentScore = JSON.parse(localStorage.getItem('highscore'))
        this.firstRank = this.add.bitmapText(290, 310, 'arcade', this.currentScore).setTint(0xff0000)

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

        this.getName = JSON.parse(localStorage.getItem('playerName'))

        let nameHighscore = { 
            score: this.currentScore,
            name: this.getName
        }

        console.log(nameHighscore)
        
        let highscoreListFromStorage = localStorage.getItem('highscoreList')
        if (highscoreListFromStorage) {
            this.highscoreList = JSON.parse(localStorage.getItem('highscoreList'))
        } else {
            this.highscoreList = []
            localStorage.setItem('highscoreList', JSON.stringify(this.highscoreList))
        }

        this.highscoreList = JSON.parse(localStorage.getItem('highscoreList'))
        // [{score: 40000, name: 'ANT'}, {score: 30000, name: '.-.'}, {score: 40000, name: 'BOB'}, {score: 150, name: 'MAT'}]
        this.highscoreList.push(nameHighscore)
        // [{score: 40000, name: 'ANT'}, {score: 30000, name: '.-.'}, {score: 40000, name: 'BOB'}, {score: 150, name: 'MAT'}, {score: 200, name: 'ABI'}]
        this.highscoreList.sort((a,b) => b.score - a.score); //Sort the highscores in descending order
        //this.highscoreList.length = 5 //This will only keep the first 5 highscores in the list, ie the highest scores
        localStorage.setItem('highscoreList', JSON.stringify(this.highscoreList))

        this.rankedList = JSON.parse(localStorage.getItem('highscoreList'))

        this.add.bitmapText(100, 360, 'arcade', this.rankedList).setTint(0xff8200)
        this.add.bitmapText(100, 410, 'arcade', '3RD   30000    .-.').setTint(0xffff00)
        this.add.bitmapText(100, 460, 'arcade', '4TH   20000    BOB').setTint(0x00ff00)
        this.add.bitmapText(100, 510, 'arcade', '5TH   10000    ZIK').setTint(0x00bfff)
    }

    updateName (name)
    {
        this.playerText.setText(name)
        localStorage.setItem('playerName', JSON.stringify(name))
    }
}