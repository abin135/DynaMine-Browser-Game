
import Phaser from "phaser"
import StartScreen from "./scenes/StartScreen.js"
import GameScreen from "./scenes/GameScreen.js"
import ScoresScreen from "./scenes/ScoresScreen.js"
import InputScreen from "./scenes/InputScreen.js"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [StartScreen, GameScreen, ScoresScreen, InputScreen]
}

export default new Phaser.Game(config)