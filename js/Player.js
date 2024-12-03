class Player {
    constructor(scene, x, y, bodyKey, headKey) {
        // Create body and head sprites
        this.body = scene.physics.add.sprite(x, y, bodyKey);
        this.head = scene.physics.add.sprite(x, y, headKey);  // Position head slightly above the body
        
        // Enable arcade physics for the player
        this.body.setCollideWorldBounds(true);  // Player can't move outside the world bounds
        this.head.setCollideWorldBounds(true);  // Head also can't go out of bounds

        // Make the player body and head "dynamic" for arcade physics (they will respond to forces, collisions, etc.)
        this.body.setBounce(0.1);  // Small bounce on collision, adjust as needed
        this.head.setBounce(0.1);  // Same for head, you can make it immovable if needed

        // Store reference to scene for later use
        this.scene = scene;
    }

    update(cursors) {
        // Reset the velocity to 0 before applying new movement
        this.body.setVelocity(0);
        this.head.setVelocity(0);

        // Handle 8-directional keyboard movement using arrow keys or WASD keys
        const speed = 160;
        
        // For 8-directional movement, check horizontal and vertical inputs separately
        if (cursors.left.isDown) {
            this.body.setVelocityX(-speed);  // Move to the left
            this.head.setVelocityX(-speed);  // Move head with body
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(speed);  // Move to the right
            this.head.setVelocityX(speed);  // Move head with body
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-speed);  // Move up
            this.head.setVelocityY(-speed);  // Move head with body
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(speed);  // Move down
            this.head.setVelocityY(speed);  // Move head with body
        }

        // Add diagonal movement for 8 directions
        if (cursors.up.isDown && cursors.left.isDown) {
            this.body.setVelocityX(-speed * 0.707);  // Diagonal left-up
            this.body.setVelocityY(-speed * 0.707);  // Diagonal left-up
        }
        if (cursors.up.isDown && cursors.right.isDown) {
            this.body.setVelocityX(speed * 0.707);  // Diagonal right-up
            this.body.setVelocityY(-speed * 0.707);  // Diagonal right-up
        }
        if (cursors.down.isDown && cursors.left.isDown) {
            this.body.setVelocityX(-speed * 0.707);  // Diagonal left-down
            this.body.setVelocityY(speed * 0.707);  // Diagonal left-down
        }
        if (cursors.down.isDown && cursors.right.isDown) {
            this.body.setVelocityX(speed * 0.707);  // Diagonal right-down
            this.body.setVelocityY(speed * 0.707);  // Diagonal right-down
        }

        // Mouse movement direction
        const mouseX = this.scene.input.mousePointer.x;
        const mouseY = this.scene.input.mousePointer.y;

        // Calculate the direction from the player to the mouse pointer
        const angle = Phaser.Math.Angle.Between(this.body.x, this.body.y, mouseX, mouseY);
        const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, mouseX, mouseY);

        // Apply the velocity based on the angle and distance (for smoother movement)
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        if (distance > 10) {  // Only move the player if the mouse is far enough away
            this.body.setVelocityX(velocityX);
            this.body.setVelocityY(velocityY);
        }

        // Make the head face the mouse direction
        this.head.setAngle(Phaser.Math.RadToDeg(angle));  // Rotate the head sprite towards the mouse
    }
}
