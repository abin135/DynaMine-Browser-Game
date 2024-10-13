const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rocks = [];
class Rock {
    constructor() {
        this.width = 100;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
function placeRocks() {
    rocks.push(new Rock(x+120, y-80));
}
            //variable for player
            var player;
            //variable for player y-position
            var playerYPosition = 200;

            function startGame() {
                gameCanvas.start();
                //create player using function
                player = new createPlayer(30, 30, 10);
            }

            //function to create the player
            function createPlayer(width, height, x) {
                this.width = width;
                this.height = height;
                this.x = x;
                this.y = playerYPosition;

                ctx = gameCanvas.context;
                ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
