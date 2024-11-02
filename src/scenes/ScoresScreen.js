import Phaser from "phaser";

export default class ScoresScreen extends Phaser.Scene {
    constructor() {
        super('scoresscreen')

        this.playerText = undefined
        this.currentScore = undefined
        this.nameHighscore = undefined
        this.getName = undefined
        this.highscoreList = undefined
        this.rankedList = undefined
    }

    preload() {
        this.load.image('highscores_bg', '/assets/background.png')
        this.load.image('back_btn', '/assets/back.png')
        this.load.image('replay_btn', '/assets/replay.png')

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
            this.scene.stop('gamescreen')
            return this.scene.stop('inputscreen')
        })

        let replayBtn = this.add.image(400, 30, 'replay_btn')
        replayBtn.setInteractive()
        replayBtn.on("pointerdown", ()=>{
            this.scene.restart('gamescreen')
            return this.scene.stop('inputscreen')
        });

        this.currentScore = JSON.parse(localStorage.getItem('highscore'))
        this.firstRank = this.add.bitmapText(200, 310, 'arcade', this.currentScore).setTint(0xff0000)
        this.showScoreHeader = this.add.bitmapText(200, 260, 'arcade', 'SCORE   NAME').setTint(0xff00ff)

        this.playerText = this.add.bitmapText(480, 310, 'arcade', '').setTint(0xff0000)

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

        //sets an empty highscore list in storage if one does not exist yet
        let highscoreListFromStorage = localStorage.getItem('highscoreList')
        if (highscoreListFromStorage) {
            this.highscoreList = JSON.parse(localStorage.getItem('highscoreList'))
        } else {
            this.highscoreList = []
            localStorage.setItem('highscoreList', JSON.stringify(this.highscoreList))
        }

        this.highscoreList = JSON.parse(localStorage.getItem('highscoreList'))
        //pushs new score to list
        this.highscoreList.push(nameHighscore)
        //sort the highscores in descending order
        this.highscoreList.sort((a,b) => b.score - a.score)
        //only keeps the first 5 highscores in the list
        this.highscoreList.length = 5
        localStorage.setItem('highscoreList', JSON.stringify(this.highscoreList))

        this.rankedList = JSON.parse(localStorage.getItem('highscoreList'))

        this.showLeaderboard()
    }

    showLeaderboard()
    {
        this.showScoreHeader.setText('')
        this.firstRank.setText('')
        this.playerText.setText('')
        this.add.bitmapText(100, 260, 'arcade', 'RANK   NAME  SCORE').setTint(0xff00ff)
        this.add.bitmapText(100, 310, 'arcade', `1ST    ${this.rankedList[0].name}    ${this.rankedList[0].score}`).setTint(0xff0000)
        this.add.bitmapText(100, 360, 'arcade', `2ND    ${this.rankedList[1].name}    ${this.rankedList[1].score}`).setTint(0xff8200)
        this.add.bitmapText(100, 410, 'arcade', `3RD    ${this.rankedList[2].name}    ${this.rankedList[2].score}`).setTint(0xffff00)
        this.add.bitmapText(100, 460, 'arcade', `4TH    ${this.rankedList[3].name}    ${this.rankedList[3].score}`).setTint(0x00ff00)
        this.add.bitmapText(100, 510, 'arcade', `5TH    ${this.rankedList[4].name}    ${this.rankedList[4].score}`).setTint(0x00bfff)
    }

    updateName (name)
    {
        this.playerText.setText(name)
        localStorage.setItem('playerName', JSON.stringify(name))
    }
}