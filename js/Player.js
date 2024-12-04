export class Player {
    constructor(scene, x, y, bodyKey, headKey) {
      // Create body and head sprites
      this.body = scene.physics.add.sprite(x, y, bodyKey);
      this.head = scene.physics.add.sprite(x, y, headKey);
  
      // Enable arcade physics for the player
      this.body.setCollideWorldBounds(true);
      this.head.setCollideWorldBounds(true);
  
      this.body.setBounce(0.1);
      this.head.setBounce(0.1);
  
      this.scene = scene;
  
      // Initialize player speed and movement properties
      this.speed = 160;
      this.acceleration = 0.075;
      this.deceleration = 0.1;
      this.velocity = new Phaser.Math.Vector2(0, 0);
  
      // Create WASD keys
      this.keys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });
  
      // Set up the camera to follow the player body
      this.scene.cameras.main.startFollow(this.body, true, 0.1, 0.1);
  
      // Initial camera zoom
      this.scene.cameras.main.setZoom(1);
    }
  
    update() {
      const mouseX =
        this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX;
      const mouseY =
        this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY;
  
      const angle = Phaser.Math.Angle.Between(
        this.body.x,
        this.body.y,
        mouseX,
        mouseY
      );
      const angleInDegrees = Phaser.Math.RadToDeg(angle);
  
      this.body.angle = angleInDegrees;
  
      // Create a direction vector based on the body's rotation
      const bodyDirection = new Phaser.Math.Vector2(
        Math.cos(Phaser.Math.DegToRad(this.head.angle)),
        Math.sin(Phaser.Math.DegToRad(this.head.angle))
      );
  
      // Reset motion each frame
      this.motion = new Phaser.Math.Vector2(0, 0);
  
      if (this.keys.left.isDown) {
        this.motion.x += 1; // Move left
      }
      if (this.keys.right.isDown) {
        this.motion.x -= 1; // Move right
      }
      if (this.keys.up.isDown) {
        this.motion.y += 1; // Move forward
      }
      if (this.keys.down.isDown) {
        this.motion.y -= 1; // Move backward
      }
  
      // Normalize motion to prevent diagonal speed boost
      this.motion.normalize();
  
      // Combine motion with body direction
      const movement = new Phaser.Math.Vector2(
        bodyDirection.x * this.motion.y + bodyDirection.y * this.motion.x,
        bodyDirection.y * this.motion.y - bodyDirection.x * this.motion.x
      );
  
      // Update velocity based on speed
      this.velocity.x = this.speed * movement.x;
      this.velocity.y = this.speed * movement.y;
  
      // Smooth velocity adjustments
      this.velocity.x = Phaser.Math.Linear(this.velocity.x, 0, this.deceleration);
      this.velocity.y = Phaser.Math.Linear(this.velocity.y, 0, this.deceleration);
  
      // Apply velocity to the body
      this.body.setVelocity(this.velocity.x, this.velocity.y);
      this.head.setVelocity(this.velocity.x, this.velocity.y);
  
      // Smoothly rotate head to follow the mouse
      const targetHeadAngle = Phaser.Math.RadToDeg(angle);
      this.head.setAngle(
        Phaser.Math.Angle.RotateTo(
          Phaser.Math.DegToRad(this.head.angle),
          Phaser.Math.DegToRad(targetHeadAngle),
          this.acceleration
        )
      );
      this.head.angle = Phaser.Math.RadToDeg(this.head.angle);
  
      // Synchronize head position with body
      this.head.setPosition(this.body.x, this.body.y);
  
      // Dynamic camera zoom based on mouse distance
      const distanceToMouse = Phaser.Math.Distance.Between(
        this.body.x,
        this.body.y,
        mouseX,
        mouseY
      );
  
      const zoomFactor = Phaser.Math.Clamp(1 + distanceToMouse / 1000, 1, 2); // Zoom between 1 and 2
      this.scene.cameras.main.setZoom(
        this.lerp(this.scene.cameras.main.zoom, zoomFactor, 0.05)
      );
    }
  
    lerp(start, end, t) {
      return (1 - t) * start + t * end;
    }
  }
  