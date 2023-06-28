window.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    const SCREEN_HEIGHT = 700;
    const SCREEN_WIDTH = 1500;
  
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
  
    const BG = new Image();
    BG.src = "Assets/Other/sunrise.jpg";
  
    // MUSIC
    const music = new Audio("Assets/music/musi.mp3");
    music.loop = true;
    
  
    // IMAGES
    const birds = new Image();
    birds.src = "Assets/Other/birds.png";
  
  
    const homePage = [new Image()];
    homePage[0].src = "Assets/horse/home.png";
  
    const flags = [new Image(), new Image()];
    flags[0].src = "Assets/Other/ethiopia flag.png";      
    flags[1].src = "Assets/Other/italy flag.png";
  
    const tank = [new Image()];
    tank[0].src = "Assets/Other/tank.png";
  
    const road = new Image();
    road.src = "Assets/Other/road 3.jpg";
  
    const RUNNING = [new Image(), new Image(), new Image()];
    RUNNING[0].src = "Assets/horse/run_1.png";
    RUNNING[1].src = "Assets/horse/run_2.png";
    RUNNING[2].src = "Assets/horse/run_3.png";
  
    const JUMPING = new Image();
    JUMPING.src = "Assets/horse/jump 2.png";
  
    const down = new Image();
    down.src = "Assets/horse/down.png";
  
    const largeObstacle = [new Image(), new Image(), new Image()];
    largeObstacle[0].src = "Assets/fire/largeFire.png";
    largeObstacle[1].src = "Assets/fire/stone 1.png";
    largeObstacle[2].src = "Assets/fire/stone 2.png";
  
    const foods = [new Image()];
    foods[0].src = "Assets/Other/food.png";
  
    const ARROWS = [new Image(), new Image(), new Image(), new Image()];
    ARROWS[0].src = "Assets/arrow/arrow.png";
    ARROWS[1].src = "Assets/arrow/arrow.png";
    ARROWS[2].src = "Assets/arrow/arrow.png";
    ARROWS[3].src = "Assets/arrow/arrow.png";
  
    const planes = [new Image(), new Image()];
    planes[0].src = "Assets/Other/plane 1.png";
    planes[1].src = "Assets/Other/plane 2.png";
  
    class HORSE {
      X_POS = 40;
      Y_POS = 430;
      Y_POS_DOWN = 510;
      JUMP_VEL = 6;
  
      constructor() {
        this.down_img = down;
        this.run_img = RUNNING;
        this.jump_img = JUMPING;
        this.horse_down = false;
        this.horse_run = true;
        this.horse_jump = false;
  
        this.step_index = 0;
        this.jump_vel = this.JUMP_VEL;
        this.image = this.run_img[0];
        this.horse_rect = { x: this.X_POS, y: this.Y_POS, width:this.image.width, height:this.image.height };
      }
  
      update(userInput) {
        if (this.horse_down) {
          this.down();
        }
        if (this.horse_run) {
          this.run();
        }
        if (this.horse_jump) {
          this.jump();
        }
  
        if (this.step_index >= 10) {
          this.step_index = 0;
        }
  
        if (userInput["ArrowUp"] && !this.horse_jump) {
          this.horse_down = false;
          this.horse_run = false;
          this.horse_jump = true;
        } else if (userInput["ArrowDown"] && !this.horse_jump) {
          this.horse_down = true;
          this.horse_run = false;
          this.horse_jump = false;
        } else if (!(this.horse_jump || userInput["ArrowDown"])) {
          this.horse_down = false;
          this.horse_run = true;
          this.horse_jump = false;
        }
      }
  
      down() {
        this.image = this.down_img;
        this.horse_rect = { x: this.X_POS, y: this.Y_POS_DOWN };
        this.step_index += 1;
      }
  
      run() {
        this.image = this.run_img[Math.floor(this.step_index / 4)];
        this.horse_rect = { x: this.X_POS, y: this.Y_POS };
        this.step_index += 1;
      }
  
      jump() {
        this.image = this.jump_img;
        if (this.horse_jump) {
          this.horse_rect.y -= this.jump_vel * 4;
          this.jump_vel -= 0.4;
        }
        if (this.jump_vel < -this.JUMP_VEL) {
          this.horse_jump = false;
          this.jump_vel = this.JUMP_VEL;
        }
      }
  
      draw() {
        ctx.drawImage(this.image, this.horse_rect.x, this.horse_rect.y);
      }
    }
  
    class Obstacle {
      constructor(image, type) {
        this.image = image;
        this.type = type;
        this.rect = { x: SCREEN_WIDTH - 380, y: 0, width: image[type].width, height: image[type].height };
      }
    
      update(gameSpeed) {
        this.rect.x -= gameSpeed;
        if (this.rect.x + this.rect.width < 0) {
          obstacles.shift();
        }
      }
    
      draw() {
        ctx.drawImage(this.image[this.type], this.rect.x, this.rect.y);
      }
    
      eatFood() {
        obstacles.shift();
      }
    }
    
  
    class Food extends Obstacle {
      constructor(image) {
        super(image, 0);
        const rand = Math.floor(Math.random() * 4);

        if (rand === 0) {
          this.rect.y = 350;
        } else if (rand === 1) {
          this.rect.y = 500;
        } else {
          this.rect.y = 550;
        }
      }
      update(gameSpeed) {
        super.update(gameSpeed);
        
      }
    }
  
    class LargeCactus extends Obstacle {
      constructor(image) {
        super(image, Math.floor(Math.random() * 3));
        this.rect.y = 540;
      }
    
      update(gameSpeed) {
        super.update(gameSpeed);
        this.rect.x -= gameSpeed; // Add this line to move the obstacle to the left
      }
    }
    
    class ARROW extends Obstacle {
      constructor(image) {
        super(image, 0);
        this.rect.y = 430;
        this.index = 0;
      }
    
      update(gameSpeed) {
        super.update(gameSpeed);
        this.rect.x -= gameSpeed; // Add this line to move the obstacle to the left
      }
    
      draw() {
        if (this.index >= 9) {
          this.index = 0;
        }
        ctx.drawImage(
          this.image[Math.floor(this.index / 4)],
          this.rect.x,
          this.rect.y
        );
        this.index += 1;
      }
    }
    
    let game_speed, x_pos_bg, y_pos_bg, points, obstacles;
    function main() {

      
      let run = true;
      const player = new HORSE();
      game_speed = 4;
      x_pos_bg = 0;
      y_pos_bg = 380;
      points = 0;
      obstacles = [];
      let death_count = 0;
      const font = "20px freesansbold";
      const playerRectWidth = player.horse_rect.x + player.image.width - player.horse_rect.x;
      const playerRectHeight = player.horse_rect.y + player.image.height - player.horse_rect.y;
  
      function score(pnt = 1) {
        points += pnt;
        if (points % 100 === 0) {
          game_speed += 0.2;
        }
        ctx.font = font;
        ctx.fillStyle = "#000000";
        ctx.fillText("Points: " + points, 1200, 60);
      }
  
      function animate() {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.drawImage(BG, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(birds, 20, 140);
        ctx.drawImage(road, 0, 580);
        ctx.drawImage(flags[0], SCREEN_WIDTH / 2 - 320, 0);
        ctx.drawImage(flags[1], SCREEN_WIDTH / 2 + 80, 0);
        ctx.drawImage(tank[0], SCREEN_WIDTH - 400, 500);
        player.draw();
        player.update(userInput);
        moveairplane();
      
        if (obstacles.length === 0) {
          if (Math.floor(Math.random() * 4) <= 1) {
            obstacles.push(new LargeCactus(largeObstacle));
          } else if (Math.floor(Math.random() * 4) === 2) {
            obstacles.push(new ARROW(ARROWS));
          } else {
            obstacles.push(new Food(foods));
          }
        }
      
       
        
        for (let i = 0; i < obstacles.length; i++) {
          const obstacle = obstacles[i];
          obstacle.draw();
          obstacle.update(game_speed);
          
        
          if (obstacle instanceof Food) {
            // this code is used to detect the collision between the food and the the horse
            if (
              player.horse_rect.x < obstacle.rect.x + obstacle.rect.width &&
              player.horse_rect.x + playerRectWidth > obstacle.rect.x &&
              player.horse_rect.y < obstacle.rect.y + obstacle.rect.height &&
              player.horse_rect.y + playerRectHeight > obstacle.rect.y
            ) {
              points += 100;
              obstacle.eatFood();
            }
          } else {
          
            let tolerance;
            if (obstacle instanceof LargeCactus) {
              tolerance = -60;
            } else {
              tolerance = -60;
            }
            console.log(player.horse_rect.y - tolerance <= obstacle.rect.y + obstacle.rect.height)
           // this one is to detect the collision between the obstacle and the horse
            if (
              player.horse_rect.x - tolerance >= obstacle.rect.x + obstacle.rect.width &&
              player.horse_rect.x + playerRectWidth + tolerance >= obstacle.rect.x &&
              player.horse_rect.y - tolerance <= obstacle.rect.y + obstacle.rect.height &&
              player.horse_rect.y + playerRectHeight + tolerance >= obstacle.rect.y
            ) {
              player.horse_run = false;
              setTimeout(function() {
                console.log("hello")
                death_count += 1;
                menu(death_count);
              }, 2000);
              return;
            }
            
            
          }
        }
        score();
      
        if (run) {
          requestAnimationFrame(animate);
        }
      }
      
  
      animate();
      
    }
  
    function menu(death_count) {
    let run = false;
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
    ctx.font = "30px freesansbold";
    ctx.fillStyle = "#000000";
    ctx.fillText("ADWA GAME", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 210);
  
    let text;
    if (death_count === 0) {
      text = "Press any Key to Start";
      music.play();
    } else {
      text = "Press any Key to Restart";
      const scoreText = `Your Score: ${points}`;
      ctx.fillText(scoreText, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 135);
    }
  
    ctx.font = "30px freesansbold";
    ctx.fillStyle = "#000000";
    ctx.fillText(text, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 170);
    ctx.drawImage(homePage[0], SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2 - 310);
  
    document.addEventListener("keypress", () => {
      if (!run) {
        run = true;
        main();
      }
    });
  }
  let x= 1400;
  let y = 100;
  let dx =10
  let dy = 2
  function moveairplane() {
    ctx.drawImage(planes[0], x, y);
   
  
    x -= dx;
    y -= dy;
    if (x < -planes[0].width) {
      x = SCREEN_WIDTH;
    }
    if (x < -planes[0].height) {
      y = 100;
    }
  
    setTimeout(moveairplane, 1000000);
    
  }
  
  
    document.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        menu(0);
      }
    });
  
    const userInput = {};
    document.addEventListener("keydown", (event) => {
      userInput[event.key] = true;
    });
  
    document.addEventListener("keyup", (event) => {
      userInput[event.key] = false;
    });
  });
  