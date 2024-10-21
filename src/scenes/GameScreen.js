import Phaser from "phaser";
import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScreen extends Phaser.Scene {
    constructor() {
        super('gamescreen');

        this.player = undefined;
        this.cursors = undefined;
        this.scoreLabel = undefined;
        this.stars = undefined;
        this.bombSpawner = undefined;

        this.gameOver = false;
    }

    preload()
    {
        this.load.image('sky', '/assets/sky.png');
        this.load.image(GROUND_KEY, '/assets/platform.png');
        this.load.image(STAR_KEY, '/assets/rock.png');
        this.load.image(BOMB_KEY, '/assets/bomb.png');
        this.load.spritesheet(DUDE_KEY, '/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create()
    {
        //  A simple background for our game
        this.add.image(400, 300, 'sky');
        
        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();

        this.scoreLabel = this.createScoreLabel(16, 16, 0);

        this.bombSpawner = new BombSpawner(this, BOMB_KEY);
        const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.stars, platforms);
		this.physics.add.collider(bombsGroup, platforms);
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectStar(player, star)
	{
		star.disableBody(true, true);

        this.scoreLabel.add(10);

        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true);
            })
        }
    
        this.bombSpawner.spawn(player.x);
	}
    
    update ()
    {
        if (this.gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown)
        {
            player.setVelocityY(-160);
        }
        else if (cursors.down.isDown)
        {
            player.setVelocityY(160);
        }
        else 
        {
            player.setVelocityY(0);
        }
    }

    hitBomb(player, bomb)
	{
		this.physics.pause();

		player.setTint(0xff0000);

		player.anims.play('turn');

		this.gameOver = true;
	}

    //  The platforms group contains the ground and the 2 ledges we can jump on
    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

        //  Now let's create some ledges
        platforms.create(600, 400, GROUND_KEY);
        platforms.create(50, 250, GROUND_KEY);
        platforms.create(750, 220, GROUND_KEY);

        return platforms;
    }
        
    createPlayer()
	{
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
		player.setCollideWorldBounds(true);

		this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

        return player;
	}

    createStars()
    {
        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        const stars = this.physics.add.staticGroup();

        stars.createMultiple({
            key: STAR_KEY,
            repeat: 3,
            setXY: { x: 25, y: 140, stepX: 70}
        });

        stars.createMultiple({
            key: STAR_KEY,
            repeat: 2,
            setXY: { x: 600, y: 100, stepX: 70 }
        });

        stars.createMultiple({
            key: STAR_KEY,
            repeat: 4,
            setXY: { x: 460, y: 310, stepX: 70 }
        });
        
        stars.createMultiple({
            key: STAR_KEY,
            repeat: 1,
            setXY: { x: 250, y: 470, stepX: 70 }
        });

        return stars;
    }

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' };
		const label = new ScoreLabel(this, x, y, score, style);

		this.add.existing(label);

		return label;
	}
}
