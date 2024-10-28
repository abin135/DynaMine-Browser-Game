import Phaser from 'phaser'

export default class DiamondSpawner
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, diamondKey = 'diamond')
	{
		this.scene = scene
		this.key = diamondKey

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(playerX = 0)
	{
		const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

        const diamond = this.group.create(x, 50, this.key)
        diamond.setBounce(1)
        diamond.setCollideWorldBounds(true)
		diamond.setVelocity(Phaser.Math.Between(-200, 200), 20)
		
		return diamond
	}
}