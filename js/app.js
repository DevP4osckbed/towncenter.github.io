import { Player } from './Player.js'

// Phaser Game Configuration with Arcade Physics enabled
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade', // Use Arcade Physics
        arcade: {
            gravity: { y: 0 }, // No gravity for now, or change as needed
            debug: false        // Set to true if you want to see physics boundaries
        }
    }
};
// Create the game instance
const game = new Phaser.Game(config);

let player;
let cursors;  // Used for player controls

function preload() {
    // Load player parts (SVGs)
    this.load.svg('body', 'assets/Body.svg');
    this.load.svg('head', 'assets/Head.svg');
}

function create() {
    // Create player instance
    player = new Player(this, 400, 300, 'body', 'head');  // Pass 'this' to have access to Phaser context
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.update(cursors);  // Update player movement
}
