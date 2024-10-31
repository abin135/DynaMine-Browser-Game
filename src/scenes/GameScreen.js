import Phaser from "phaser"
import ScoreLabel from "../ui/ScoreLabel"
import BombSpawner from "./BombSpawner"
import DiamondSpawner from "./DiamondSpawner"

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const ROCK_KEY = 'rock'
const BOMB_KEY = 'bomb'
const DIAMOND_KEY = 'diamond'

export default class GameScreen extends Phaser.Scene {
    constructor() {
        super('gamescreen')

        this.player = undefined
        this.keys = undefined
        this.scoreLabel = undefined
        this.rocks = undefined
        this.bombSpawner = undefined
        this.diamondSpawner = undefined

        this.gameOver = false
    }

    preload()
    {
        this.load.image('cave', '/assets/background.png')
        this.load.image(GROUND_KEY, '/assets/wall.png')
        this.load.image(ROCK_KEY, '/assets/rock.png')
        this.load.image(BOMB_KEY, '/assets/bomb.png')
        this.load.image(DIAMOND_KEY, '/assets/diamond.png')
        this.load.spritesheet(DUDE_KEY, '/assets/dude.png', { frameWidth: 32, frameHeight: 48 })
        this.load.image('replay', '/assets/replay.png')
        this.load.image('highscoresRed', '/assets/highscoresBtn.png')
        this.load.image('saveScore', '/assets/savescores.png')
    }

    create()
    {
        // background for game
        this.add.image(400, 300, 'cave')
        
        const walls = this.createWalls()
        this.player = this.createPlayer()
        this.rocks = this.createRocks()

        this.scoreLabel = this.createScoreLabel(16, 16, 0)

        this.bombSpawner = new BombSpawner(this, BOMB_KEY)
        const bombsGroup = this.bombSpawner.group

        this.diamondSpawner = new DiamondSpawner(this, DIAMOND_KEY)
        const diamondsGroup = this.diamondSpawner.group

        this.physics.add.collider(this.player, walls)
        this.physics.add.collider(this.rocks, walls)
		this.physics.add.collider(bombsGroup, walls)
        this.physics.add.collider(diamondsGroup, walls)
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)
        this.physics.add.collider(this.player, diamondsGroup, this.hitDiamond, null, this)

        this.physics.add.overlap(this.player, this.rocks, this.mineRock, null, this)

        this.keys = this.input.keyboard.addKeys('A,D,W,S,Z,X')
    }

    mineRock(player, rock)
	{
        this.scoreLabel.add(10)
        rock.disableBody(true, true)
        
        if (this.rocks.countActive(true) === 0)
        {
            // a new batch of rocks to mine when 0 rocks left
            this.rocks.children.iterate((child) => {
                child.enableBody(true, child.x, child.y, true, true)
            })
            // spawns bomb and diamond when all rocks are mined
            this.bombSpawner.spawn(player.x)
            this.diamondSpawner.spawn(player.x)
        }
	}
    
    update ()
    {
        //when its gameover give replay and highscores buttons
        if (this.gameOver)
        {
            let replayBtn = this.add.image(400, 300, 'replay')
            replayBtn.setInteractive()
            replayBtn.on("pointerdown", ()=>{
                this.scene.restart('gamescreen')
                return this.gameOver = false
            });
    
            let highscoresBtn = this.add.image(400, 400, 'highscoresRed')
            highscoresBtn.setInteractive()
            highscoresBtn.on("pointerdown", ()=>{
                this.scene.start('scoresscreen')
                return this.gameOver = false
            });

            let saveScoreBtn = this.add.image(400, 500, 'saveScore')
            saveScoreBtn.setInteractive()
            saveScoreBtn.on("pointerdown", ()=>{
                this.saveScore()
                this.scene.start('scoresscreen')
                return this.gameOver = false
            })
        }

        //player movement
        if (this.keys.A.isDown)
        {
            this.player.setVelocityX(-160)

            this.player.anims.play('left', true)
        }
        else if (this.keys.D.isDown)
        {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true)
        }
        else
        {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if (this.keys.W.isDown)
        {
            this.player.setVelocityY(-160)

            this.player.anims.play('turn', true)
        }
        else if (this.keys.S.isDown)
        {
            this.player.setVelocityY(160)
        }
        else 
        {
            this.player.setVelocityY(0)
        }
    }

    hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}

    hitDiamond(player, diamond)
    {
        this.scoreLabel.add(50)
        diamond.disableBody(true, true)
    }
    
    //  The walls group contains the 3 walls
    createWalls()
    {
        const walls = this.physics.add.staticGroup()

        // create the ground wall
        // scaled to fit the width of the game (the original sprite is 400x32 in size)
        walls.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

        //create the smaller walls
        walls.create(600, 400, GROUND_KEY)
        walls.create(50, 250, GROUND_KEY)
        walls.create(750, 220, GROUND_KEY)

        return walls
    }
        
    createPlayer()
	{
        const player = this.physics.add.sprite(100, 450, DUDE_KEY)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

        return player
	}

    createRocks()
    {
        //  Some rocks to mine, evenly spaced 70 pixels apart along the x axis
        const rocks = this.physics.add.staticGroup()

        rocks.createMultiple({
            key: ROCK_KEY,
            repeat: 3,
            setXY: { x: 25, y: 140, stepX: 70}
        })

        rocks.createMultiple({
            key: ROCK_KEY,
            repeat: 2,
            setXY: { x: 600, y: 100, stepX: 70 }
        })

        rocks.createMultiple({
            key: ROCK_KEY,
            repeat: 4,
            setXY: { x: 460, y: 310, stepX: 70 }
        })
        
        rocks.createMultiple({
            key: ROCK_KEY,
            repeat: 1,
            setXY: { x: 250, y: 470, stepX: 70 }
        })

        return rocks
    }

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#FFFFFF' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

    saveScore()
    {
        localStorage.setItem('highscore', JSON.stringify(this.scoreLabel.score))
    }
}
